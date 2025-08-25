"use client"
import React, { useEffect, useRef, useState } from "react";
import socket from "../utils/socket";

const VideoCall = () => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const [roomId] = useState("test-room");
  const [callType, setCallType] = useState(null);

  useEffect(() => {
    socket.emit("join-call", roomId);

    socket.on("offer", async (data) => {
      console.log("Got Offer", data);
      pcRef.current = new RTCPeerConnection();
      addTrackHandlers();

      // get media because this user is callee
      const stream = await navigator.mediaDevices.getUserMedia({
        video: callType === "video",
        audio: true,
      });
      localVideoRef.current.srcObject = stream;
      stream.getTracks().forEach((t) => pcRef.current.addTrack(t, stream));

      await pcRef.current.setRemoteDescription(new RTCSessionDescription(data.sdp));
      const answer = await pcRef.current.createAnswer();
      await pcRef.current.setLocalDescription(answer);
      socket.emit("answer", { sdp: answer, roomId });
    });

    socket.on("answer", async (data) => {
      console.log("Got Answer", data);
      await pcRef.current.setRemoteDescription(new RTCSessionDescription(data.sdp));
    });

    socket.on("ice-candidate", async (data) => {
      try {
        await pcRef.current.addIceCandidate(data.candidate);
      } catch (err) {
        console.error("Error adding ICE", err);
      }
    });

    socket.on("call-ended", () => {
      console.log("Call ended by remote");
      endCall();
    });

    return () => {
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("call-ended");
    };
  }, [roomId, callType]);

  const addTrackHandlers = () => {
    pcRef.current.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };
    pcRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", { candidate: event.candidate, roomId });
      }
    };
  };

  const startCall = async (type) => {
    setCallType(type);
    pcRef.current = new RTCPeerConnection();
    addTrackHandlers();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: type === "video",
        audio: true,
      });

      localVideoRef.current.srcObject = stream;
      stream.getTracks().forEach((track) => pcRef.current?.addTrack(track, stream));

      const offer = await pcRef.current.createOffer();
      await pcRef.current.setLocalDescription(offer);
      socket.emit("offer", { sdp: offer, roomId });
    } catch (err) {
      console.error("Media error:", err);
      alert("Camera/Mic error. Check permissions.");
    }
  };

  const endCall = () => {
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    if (localVideoRef.current?.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    localVideoRef.current.srcObject = null;
    remoteVideoRef.current.srcObject = null;
    socket.emit("end-call", roomId);
    setCallType(null);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Audio / Video Call Demo</h2>
      <div className="flex gap-4">
        <video ref={localVideoRef} autoPlay playsInline muted className="w-1/2 border rounded" />
        <video ref={remoteVideoRef} autoPlay playsInline className="w-1/2 border rounded" />
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => startCall("audio")}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Start Audio Call
        </button>
        <button
          onClick={() => startCall("video")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Start Video Call
        </button>
        <button
          onClick={endCall}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          End Call
        </button>
      </div>
    </div>
  );
};

export default VideoCall;
