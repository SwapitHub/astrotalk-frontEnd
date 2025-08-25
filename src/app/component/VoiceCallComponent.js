"use client";
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

// ✅ Socket connection
const socket = io(process.env.NEXT_PUBLIC_WEBSITE_URL, {
  autoConnect: false,
});

const CallComponent = () => {
  const [myId, setMyId] = useState("");
  const [targetId, setTargetId] = useState("");
  const [inCall, setInCall] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const localStream = useRef(null);
  const pendingCandidates = useRef([]);

  const servers = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  // ===============================
  // SOCKET LISTENERS
  // ===============================
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("✅ Connected with ID:", socket.id);
      setMyId(socket.id);
    });

    socket.on("receive-call", async ({ callerSocketId, offer }) => {
      console.log("📞 Incoming call from", callerSocketId);

      await prepareLocalStream(true); // auto accept w/ video+audio
      createPeerConnection(callerSocketId);

      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);

      socket.emit("answer-call", { targetSocketId: callerSocketId, answer });
      setInCall(true);

      // Apply stored ICE candidates
      pendingCandidates.current.forEach((c) => {
        peerConnection.current.addIceCandidate(new RTCIceCandidate(c));
      });
      pendingCandidates.current = [];
    });

    socket.on("call-answered", async ({ answer }) => {
      console.log("📩 Call answered!");
      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
      }
      setInCall(true);
    });

    socket.on("ice-candidate", ({ candidate }) => {
      const ice = new RTCIceCandidate(candidate);
      if (peerConnection.current?.remoteDescription) {
        peerConnection.current.addIceCandidate(ice);
      } else {
        pendingCandidates.current.push(candidate);
      }
    });

    socket.on("call-ended", () => {
      console.log("❌ Call ended by remote user");
      endCall();
    });

    return () => {
      socket.off("connect");
      socket.off("receive-call");
      socket.off("call-answered");
      socket.off("ice-candidate");
      socket.off("call-ended");
    };
  }, []);

  // ===============================
  // STREAM SETUP
  // ===============================
  const prepareLocalStream = async (withVideo = false) => {
    if (!localStream.current) {
      try {
        localStream.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: withVideo,
        });
        console.log("🎤📷 Local stream started");

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream.current;
        }
      } catch (err) {
        console.error("⚠️ Media access failed", err);
        alert("Please allow microphone/camera access.");
        throw err;
      }
    }
  };

  // ===============================
  // PEER CONNECTION SETUP
  // ===============================
  const createPeerConnection = (otherId) => {
    peerConnection.current = new RTCPeerConnection(servers);

    // Add local tracks
    localStream.current.getTracks().forEach((track) => {
      peerConnection.current.addTrack(track, localStream.current);
    });

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          targetSocketId: otherId,
          candidate: event.candidate,
        });
      }
    };

    peerConnection.current.ontrack = (event) => {
      console.log("📡 Remote stream received");
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };
  };

  // ===============================
  // CALL ACTIONS   
  // ===============================
  const startCall = async (withVideo) => {
    if (!targetId) return alert("Enter target socket ID.");

    await prepareLocalStream(withVideo);
    createPeerConnection(targetId);

    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);

    socket.emit("call-user", { targetSocketId: targetId, offer });
  };

  const endCall = () => {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    // ✅ Stop local stream tracks (turns off cam/mic)
    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => track.stop());
      localStream.current = null;
    }

    // ✅ Clear video elements
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    setInCall(false);

    // 🔥 Notify the other user
    if (targetId) {
      socket.emit("end-call", { targetSocketId: targetId });
    }

    // (optional) Reset targetId so you don’t accidentally reuse it
    // setTargetId("");
  };



  // ===============================
  // UI
  // ===============================
  return (
    <div style={{ padding: 20 }}>
      <h3>My Socket ID: {myId || "Connecting..."}</h3>

      <input
        type="text"
        placeholder="Enter target socket ID"
        value={targetId}
        onChange={(e) => setTargetId(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />


      <div style={{ marginBottom: 10 }}>
        <button onClick={() => startCall(false)} style={{ marginRight: 10 }}>
          🎤 Start Audio Call
        </button>
        <button onClick={() => startCall(true)}>
          📹 Start Video Call
        </button>
      </div>

      <button
        onClick={endCall}
        style={{ backgroundColor: "red", color: "white" }}
      >
        ❌ End Call
      </button>


      <div style={{ display: "flex", gap: "20px", marginTop: 20 }}>
        <div>
          <h4>My Stream</h4>
          <video ref={localVideoRef} autoPlay muted playsInline style={{ width: 250, background: "#000" }} />
        </div>
        <div>
          <h4>Remote Stream</h4>
          <video ref={remoteVideoRef} autoPlay playsInline style={{ width: 250, background: "#000" }} />
        </div>
      </div>
    </div>
  );
};

export default CallComponent;
