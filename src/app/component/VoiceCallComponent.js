"use client";
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

// Create and export socket (change to your backend if needed)
const socket = io(process.env.NEXT_PUBLIC_WEBSITE_URL || "http://localhost:8080", {
  autoConnect: false,
  transports: ["websocket"],
});

const VoiceCallComponent = () => {
  const [myId, setMyId] = useState("");
  const [targetId, setTargetId] = useState("");
  const localAudioRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const peerConnection = useRef(null);
  const pendingCandidates = useRef([]);
  const localStream = useRef(null);

  const servers = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  useEffect(() => {
    if (!socket.connected) socket.connect();

    socket.on("connect", () => {
      console.log("🟢 Connected with ID:", socket.id);
      setMyId(socket.id);
    });

    socket.on("receive-call", async ({ callerSocketId, offer }) => {
      try {
        await prepareLocalStream();
        peerConnection.current = new RTCPeerConnection(servers);
        addTracksToPeer(localStream.current);

        peerConnection.current.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit("ice-candidate", {
              targetSocketId: callerSocketId,
              candidate: event.candidate,
            });
          }
        };

        peerConnection.current.ontrack = (event) => {
          const remoteStream = event.streams[0];
          if (remoteAudioRef.current) {
            remoteAudioRef.current.srcObject = remoteStream;
            remoteAudioRef.current.onloadedmetadata = () => {
              remoteAudioRef.current.play().catch((err) =>
                console.error("🔇 Audio play error:", err)
              );
            };
            console.log("🔊 Remote stream received");
          }
        };

        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);

        socket.emit("answer-call", {
          targetSocketId: callerSocketId,
          answer,
        });

        // Handle buffered ICE
        pendingCandidates.current.forEach((candidate) => {
          peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
        });
        pendingCandidates.current = [];
      } catch (err) {
        console.error("❌ Error answering call:", err);
      }
    });

    socket.on("call-answered", async ({ answer }) => {
      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
        console.log("✅ Call answered");
      }
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

  const prepareLocalStream = async () => {
    if (!localStream.current) {
      try {
        localStream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (localAudioRef.current) {
          localAudioRef.current.srcObject = localStream.current;
        }
        console.log("🎤 Microphone stream started ✅", localStream.current);
      } catch (err) {
        alert("Please allow microphone access.");
        throw err;
      }
    }
  };

  const addTracksToPeer = (stream) => {
    stream.getTracks().forEach((track) => {
      console.log("🎧 Adding local track to peer:", track);
      peerConnection.current.addTrack(track, stream);
    });
  };

  const startCall = async () => {
    if (!targetId) return alert("Enter target socket ID");

    try {
      await prepareLocalStream();

      peerConnection.current = new RTCPeerConnection(servers);
      addTracksToPeer(localStream.current);

      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", {
            targetSocketId: targetId,
            candidate: event.candidate,
          });
        }
      };

      peerConnection.current.ontrack = (event) => {
        const remoteStream = event.streams[0];
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = remoteStream;
          remoteAudioRef.current.onloadedmetadata = () => {
            remoteAudioRef.current.play().catch((err) =>
              console.error("🔇 Play failed:", err)
            );
          };
          console.log("📶 Remote audio connected");
        }
      };

      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);

      socket.emit("call-user", {
        targetSocketId: targetId,
        offer,
      });
      console.log("📞 Call initiated to", targetId);
    } catch (err) {
      console.error("❌ Error starting call:", err);
    }
  };

  const endCall = () => {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    socket.emit("end-call", { targetSocketId: targetId });
    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = null;
    }
    console.log("❌ Call ended");
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>🔌 My Socket ID: {myId || "Connecting..."}</h3>

      <input
        type="text"
        placeholder="Enter target socket ID"
        value={targetId}
        onChange={(e) => setTargetId(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <div style={{ marginBottom: 10 }}>
        <button onClick={startCall} style={{ marginRight: 10 }}>
          📞 Call
        </button>
        <button onClick={endCall} style={{ backgroundColor: "red", color: "white" }}>
          ❌ End
        </button>
      </div>

      <h4>🎙️ My Audio</h4>
      <audio ref={localAudioRef} autoPlay muted controls />

      <h4>🎧 Remote Audio</h4>
      <audio ref={remoteAudioRef} autoPlay playsInline controls />
    </div>
  );
};

export default VoiceCallComponent;
