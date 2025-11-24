"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

import Loader from "@/app/component/Loader";
import Link from "next/link";
import { AiOutlineAudio, AiOutlineAudioMuted } from "react-icons/ai";
import { MdOutlineVideocam, MdOutlineVideocamOff } from "react-icons/md";
import secureLocalStorage from "react-secure-storage";

// Initialize socket connection
const apiURL = process.env.NEXT_PUBLIC_WEBSITE_URL || "";
const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
const isLocal = apiURL.includes("localhost");

const socket = io(isLocal ? apiURL : baseURL, {
 path: isLocal ? undefined : "/api/socket.io",
  transports: ["websocket"],
  withCredentials: true,
  autoConnect: false,
});

const Call = () => {
  const router = useRouter();
  const { roomId } = useParams();
  const [myId, setMyId] = useState("");
  const [remoteUsers, setRemoteUsers] = useState({}); // socketId -> MediaStream
  const pcsd = useRef({}); // keep peer connections in a ref so they persist
  const param = useParams();

  const localVideoRef = useRef(null);
  const localStream = useRef(null);
  const screenTrackRef = useRef(null);

  const [voiceMedia, setVoiceMedia] = useState(true);
  const [videoMedia, setVideoMedia] = useState(true);
  const [remoteMicStatus, setRemoteMicStatus] = useState({});
  const [getSocketId, setGetSocketId] = useState(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showJoinRoom, setShowJoinRoom] = useState(false);
  const [getUserCall, setGetUserCall] = useState();
  const [loader, setLoder] = useState(false);
  const [roomIdShow, setRoomIdShow] = useState(
    secureLocalStorage.getItem("roomId")
  );
  console.log(showJoinRoom, "showJoinRoom");

  useEffect(() => {
    setIsScreenSharing(!!getSocketId);
  }, [getSocketId]);

  useEffect(() => {
    socket.connect();

    socket.on("connect", async () => {
      setMyId(socket.id);
      await startLocalStream();

      socket.emit("join-room", { roomId, userId: socket.id });
    });

    // OFFER
    socket.on("user-joined", async ({ socketId }) => {
      const pc = createPeerConnection(socketId);

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit("offer", { roomId, targetSocketId: socketId, offer });
    });

    // OFFER RECEIVED
    socket.on("offer", async ({ senderSocketId, offer }) => {
      const pc = createPeerConnection(senderSocketId);
      await pc.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("answer", { targetSocketId: senderSocketId, answer });
    });

    // ANSWER RECEIVED
    socket.on("answer", async ({ senderSocketId, answer }) => {
      pcsd.current[senderSocketId]?.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    });

    socket.on("ice-candidate", ({ senderSocketId, candidate }) => {
      pcsd.current[senderSocketId]?.addIceCandidate(
        new RTCIceCandidate(candidate)
      );
    });

    socket.on("user-left", ({ socketId }) => {
      if (pcsd.current[socketId]) pcsd.current[socketId].close();
      delete pcsd.current[socketId];

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

  const startLocalStream = async () => {
    localStream.current = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localVideoRef.current.srcObject = localStream.current;
  };

  const createPeerConnection = (remoteSocketId) => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" }, // STUN
        {
          urls: "turn:relay1.expressturn.com:3478", // Public TURN service (for testing)
          username: "expressturn",
          credential: "expressturn",
        },
      ],
    });

    pcsd.current[remoteSocketId] = pc; // ✅ save only here

    // Add local tracks (camera/audio by default)
    localStream.current?.getTracks().forEach((track) => {
      pc.addTrack(track, localStream.current);
    });

    // Handle remote track
    pc.ontrack = (event) => {
      setRemoteUsers((prev) => ({
        ...prev,
        [remoteSocketId]: event.streams[0],
      }));
    };

    // ICE
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

  useEffect(() => {
    socket.on("join-user-call-new-notification", ({ roomId }) => {
      console.log("User asked to join call for room:", roomId.roomId);
      setGetUserCall(roomId.roomId);
    });

    socket.on("accept-join-user-call-new-notification", ({ roomId }) => {
      console.log("User asked to join call for room:", roomId.roomId);
      router.push(`/LiveCall/${param.roomId}`);
    });

    return () => {
      socket.off("join-user-call-new-notification");
      socket.off("accept-join-user-call-new-notification");
    };
  }, [socket]);

  const handleAskToJoin = () => {
    setLoder(true);
    socket.emit("join-user-call", {
      roomId,
    });
  };

  return (
    <main>
      {loader && <Loader />}
      <div className="container">
        <div className="show-room-join">
          <div className="left-show-room">
            <div className="live-video">
              <video ref={localVideoRef} autoPlay muted playsInline />
            </div>

            <div className="video_call_controls-join">
              <div className="video_call_row">
                <div className="v-cntrl" onClick={toggleAudio}>
                  {" "}
                  {voiceMedia ? <AiOutlineAudio /> : <AiOutlineAudioMuted />}
                </div>
                <div className="v-cntrl" onClick={toggleVideo}>
                  {" "}
                  {videoMedia ? (
                    <MdOutlineVideocam />
                  ) : (
                    <MdOutlineVideocamOff />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="right-show-room">
            <h2>Ready to join</h2>

            {roomIdShow == roomId ? (
              <>
                {getUserCall ? (
                  <p>another user wait on room</p>
                ) : (
                  <p>No one else is here</p>
                )}

                <Link href={`/LiveCall/${param.roomId}`}>Join Now</Link>
              </>
            ) : (
              <button onClick={handleAskToJoin}>Ask to join</button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Call;
