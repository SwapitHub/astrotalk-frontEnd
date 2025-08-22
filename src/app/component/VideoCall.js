// src/components/VideoCall.js
"use client"
import React, { useEffect, useRef, useState } from "react";
import socket from "../utils/socket";

const VideoCall = () => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const [roomId] = useState("test-room"); // demo ke liye ek static room

  useEffect(() => {
    // socket connect hote hi room join karna
    socket.emit("join-call", roomId);

    socket.on("user-joined", (userId) => {
      console.log("User joined:", userId);
      // jab koi naya user join kare to call start karna
      startCall();
    });

    socket.on("offer", async (data) => {
      console.log("Got Offer", data);
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
      console.log("Got ICE", data);
      try {
        await pcRef.current.addIceCandidate(data.candidate);
      } catch (err) {
        console.error("Error adding ice candidate", err);
      }
    });

    return () => {
      socket.off("user-joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
    };
  }, [roomId]);

  // startCall function
 const startCall = async () => {
  pcRef.current = new RTCPeerConnection();

  try {
    // Sirf audio ka stream lo
    const stream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true,
    });

    // Local audio ko play karne ke liye (agar chahiye to headphones me suna sakte ho)
    localVideoRef.current.srcObject = stream;

    // Tracks add kar do PeerConnection me
    stream.getTracks().forEach((track) => pcRef.current.addTrack(track, stream));

    // Remote se audio receive hote hi set kar do
    pcRef.current.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    // ICE candidate share karo
    pcRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", { candidate: event.candidate, roomId });
      }
    };

    // Offer create aur send karo
    const offer = await pcRef.current.createOffer();
    await pcRef.current.setLocalDescription(offer);
    socket.emit("offer", { sdp: offer, roomId });

  } catch (err) {
    console.error("Mic error:", err);
    alert("Microphone not found or permission denied. Please check browser settings.");
  }
};


  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Video Call Demo</h2>
      <div className="flex gap-4">
        <video ref={localVideoRef} autoPlay playsInline muted className="w-1/2 border rounded" />
        <video ref={remoteVideoRef} autoPlay playsInline className="w-1/2 border rounded" />
      </div>
      <button
        onClick={startCall}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
      >
        Start Call
      </button>
    </div>
  );
};

export default VideoCall;
