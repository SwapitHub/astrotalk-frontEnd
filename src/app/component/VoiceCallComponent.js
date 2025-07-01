import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

// ✅ Define socket outside the component to avoid multiple instances
const socket = io(process.env.NEXT_PUBLIC_WEBSITE_URL, {
  autoConnect: false, // we'll connect manually
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

  // 🔁 Setup socket connection and listeners
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Connected with ID:", socket.id);
      setMyId(socket.id);
    });

    socket.on("call-answered", async ({ answer }) => {
      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
      }
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
          remoteAudioRef.current.srcObject = event.streams[0];
        };

        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);

        socket.emit("answer-call", {
          targetSocketId: callerSocketId,
          answer,
        });

        // Apply pending ICE candidates
        pendingCandidates.current.forEach((candidate) => {
          peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
        });
        pendingCandidates.current = [];

      } catch (error) {
        console.error("Error answering call:", error);
      }
    });

    socket.on("ice-candidate", ({ candidate }) => {
      const iceCandidate = new RTCIceCandidate(candidate);
      if (peerConnection.current?.remoteDescription) {
        peerConnection.current.addIceCandidate(iceCandidate);
      } else {
        pendingCandidates.current.push(candidate);
      }
    });

    socket.on("call-ended", () => {
      endCall();
    });

    return () => {
      socket.off("connect");
      socket.off("call-answered");
      socket.off("receive-call");
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
      } catch (err) {
        alert("Microphone access denied.");
        throw err;
      }
    }
  };

  const addTracksToPeer = (stream) => {
    stream.getTracks().forEach((track) => {
      peerConnection.current.addTrack(track, stream);
    });
  };

  const startCall = async () => {
    if (!targetId) return alert("Enter target socket ID.");

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
        remoteAudioRef.current.srcObject = event.streams[0];
      };

      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);

      socket.emit("call-user", {
        targetSocketId: targetId,
        offer,
      });

    } catch (err) {
      console.error("Error starting call:", err);
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
  };

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
        <button onClick={startCall} style={{ marginRight: 10 }}>
          📞 Call
        </button>
        <button onClick={endCall} style={{ backgroundColor: "red", color: "white" }}>
          ❌ End
        </button>
      </div>

      <h4>My Audio</h4>
      <audio ref={localAudioRef} autoPlay muted />
      <h4>Remote Audio</h4>
      <audio ref={remoteAudioRef} autoPlay playsInline />
    </div>
  );
};

export default VoiceCallComponent;
