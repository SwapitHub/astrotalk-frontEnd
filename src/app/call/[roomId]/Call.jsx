"use client";
import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { io } from "socket.io-client";

import { AiOutlineAudio, AiOutlineAudioMuted } from "react-icons/ai";
import { IoDownloadOutline, IoSettingsOutline } from "react-icons/io5";
import {
  MdCallEnd,
  MdOutlineVideocam,
  MdOutlineVideocamOff,
} from "react-icons/md";
import ScreenShare from "@/app/component/ScreenShare";

const socket = io(process.env.NEXT_PUBLIC_WEBSITE_URL, { autoConnect: false });

const Call = () => {
  const router = useRouter();
  const { roomId } = useParams();
  const [myId, setMyId] = useState("");
  const [remoteUsers, setRemoteUsers] = useState({}); // socketId -> MediaStream
  const pcsd = useRef({}); // keep peer connections in a ref so they persist

  const localVideoRef = useRef(null);
  const localStream = useRef(null);

  const [voiceMedia, setVoiceMedia] = useState(true);
  const [videoMedia, setVideoMedia] = useState(true);
  const [remoteMicStatus, setRemoteMicStatus] = useState({}); // { socketId: true/false }

  useEffect(() => {
    socket.connect();

    socket.on("connect", async () => {
      setMyId(socket.id);
      await startLocalStream();

      socket.emit("join-room", { roomId, userId: socket.id });
    });

    socket.on("user-joined", async ({ socketId }) => {
      const pc = createPeerConnection(socketId);

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit("offer", { roomId, targetSocketId: socketId, offer });
    });

    socket.on("offer", async ({ senderSocketId, offer }) => {
      const pc = createPeerConnection(senderSocketId);
      await pc.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("answer", { targetSocketId: senderSocketId, answer });
    });

    socket.on("answer", async ({ senderSocketId, answer }) => {
      pcs[senderSocketId]?.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    });

    socket.on("ice-candidate", ({ senderSocketId, candidate }) => {
      pcs[senderSocketId]?.addIceCandidate(new RTCIceCandidate(candidate));
    });

    socket.on("user-left", ({ socketId }) => {
      if (pcs[socketId]) pcs[socketId].close();
      delete pcs[socketId];

      setRemoteUsers((prev) => {
        const updated = { ...prev };
        delete updated[socketId];
        return updated;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Keep track of PeerConnections separately
  const pcs = {};

  const startLocalStream = async () => {
    localStream.current = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localVideoRef.current.srcObject = localStream.current;
  };

  const createPeerConnection = (remoteSocketId) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    pcs[remoteSocketId] = pc;

    // Add local tracks
    localStream.current
      .getTracks()
      .forEach((track) => pc.addTrack(track, localStream.current));

    // Handle remote track
    pc.ontrack = (event) => {
      setRemoteUsers((prev) => ({
        ...prev,
        [remoteSocketId]: event.streams[0],
      }));
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          targetSocketId: remoteSocketId,
          candidate: event.candidate,
        });
      }
    };

    return pc;
  };

  // END CALL FUNCTION
  const endCall = () => {
    // 1. Stop local tracks (turn off camera & mic)
    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => track.stop());
      localStream.current = null;
    }

    // 2. Close all peer connections
    Object.values(pcsd.current).forEach((pc) => pc.close());
    pcsd.current = {};

    // 3. Tell server you left
    socket.emit("leave-room", { roomId, socketId: myId });

    // 4. Clear UI state
    setRemoteUsers({});
    setMyId("");

    // Optionally disconnect socket
    socket.disconnect();

    window.location.href = "/";
  };

  const toggleAudio = () => {
    const audioTrack = localStream.current?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setVoiceMedia(audioTrack.enabled);

      // 🔴 Emit to other users
      socket.emit("toggle-mic", {
        roomId,
        userId: myId,
        isMicOn: audioTrack.enabled,
      });
    }
  };

  const toggleVideo = () => {
    const videoTrack = localStream.current?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setVideoMedia(videoTrack.enabled);
    }
  };

  socket.on("user-mic-toggled", ({ socketId, isMicOn }) => {
    setRemoteMicStatus((prev) => ({
      ...prev,
      [socketId]: isMicOn,
    }));
  });

  return (
    <main>
      <div style={{ padding: 20 }}>
        {/* <h2>Meeting Room: {roomId}</h2> */}
        <p>My ID: {myId}</p>

        {/* My video */}
        {/* <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          style={{ width: 200, background: "#000" }}
        /> */}

        {/* Remote videos */}
        {/* <div
          className="remote-videos"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginTop: 20,
          }}
        >
          {Object.entries(remoteUsers).map(([id, stream]) => (
            <video
              key={id}
              autoPlay
              playsInline
              ref={(videoEl) => {
                if (videoEl && !videoEl.srcObject) videoEl.srcObject = stream;
              }}
              style={{ width: 200, background: "#000" }}
            />
          ))}
        </div> */}
      </div>

      {/* Controls */}
      <div className="video_call_seciton">
        <div className="container">
          <div className="video_call_innner">
            <div className="video-chat-row">
              <div className="video_col">
                <div className="video_row">
                  <div className="col main-video">
                    <div className="icons">
                      <div className="mic">
                        {" "}
                        {voiceMedia ? (
                          <AiOutlineAudio />
                        ) : (
                          <AiOutlineAudioMuted />
                        )}
                      </div>{" "}
                    </div>{" "}
                    <div className="placeholder_img">
                      {/* My video main videos*/}
                      <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        playsInline
                        style={{ width: 200, background: "#000" }}
                      />
                    </div>
                  </div>
                  {/* remote videos other user videos*/}
                  {Object.entries(remoteUsers).map(([id, stream]) => (
                    <>
                      <div className="col">
                        <div className="icons">
                          <div className="mic">
                            {" "}
                            {remoteMicStatus[id] === false ? (
                              <AiOutlineAudioMuted />
                            ) : (
                              <AiOutlineAudio />
                            )}
                          </div>{" "}
                        </div>{" "}
                        <div className="placeholder_img">
                          <video
                            key={id}
                            autoPlay
                            playsInline
                            muted={remoteMicStatus[id] === false}
                            ref={(videoEl) => {
                              if (videoEl && !videoEl.srcObject)
                                videoEl.srcObject = stream;
                            }}
                            style={{ width: 200, background: "#000" }}
                          />
                        </div>
                      </div>
                    </>
                  ))}
                </div>
                <div className="video_call_controls">
                  <div className="video_call_row">
                    <div className="v-cntrl" onClick={toggleAudio}>
                      {" "}
                      {voiceMedia ? (
                        <AiOutlineAudio />
                      ) : (
                        <AiOutlineAudioMuted />
                      )}
                    </div>
                    <div className="v-cntrl" onClick={toggleVideo}>
                      {" "}
                      {videoMedia ? (
                        <MdOutlineVideocam />
                      ) : (
                        <MdOutlineVideocamOff />
                      )}
                    </div>
                    <div className="v-cntrl">
                      <ScreenShare pcsd={pcsd} localVideoRef={localVideoRef} />
                    </div>
                    <div className="v-cntrl">
                      <IoDownloadOutline />
                    </div>
                    <div className="v-cntrl">
                      <IoSettingsOutline />
                    </div>
                    <div className="v-cntrl call-end" onClick={endCall}>
                      <MdCallEnd />
                    </div>
                  </div>
                </div>
              </div>
              <div className="chat_col"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Call;
