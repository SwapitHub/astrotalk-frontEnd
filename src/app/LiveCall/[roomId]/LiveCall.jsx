"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

import RecordingScreen from "@/app/component/RecordingScreen";
import ScreenShare from "@/app/component/ScreenShare";
import { AiOutlineAudio, AiOutlineAudioMuted } from "react-icons/ai";
import { IoSettingsOutline } from "react-icons/io5";
import {
    MdCallEnd,
    MdOutlineVideocam,
    MdOutlineVideocamOff,
} from "react-icons/md";
import secureLocalStorage from "react-secure-storage";
import Loader from "@/app/component/Loader";

const socket = io(process.env.NEXT_PUBLIC_BASE_URL, {
  path: "/api/socket.io",
  transports: ["websocket"],
  withCredentials: true,
  autoConnect: false,
});

const LiveCall = () => {
  const router = useRouter();
  const param = useParams()


    const { roomId } = useParams();
    const [myId, setMyId] = useState("");
    const [remoteUsers, setRemoteUsers] = useState({}); // socketId -> MediaStream
    const pcsd = useRef({}); // keep peer connections in a ref so they persist

    const localVideoRef = useRef(null);
    const localStream = useRef(null);
    const screenTrackRef = useRef(null);

    const [voiceMedia, setVoiceMedia] = useState(true);
    const [videoMedia, setVideoMedia] = useState(true);
    const [remoteMicStatus, setRemoteMicStatus] = useState({});
    const [getSocketId, setGetSocketId] = useState(null);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [showJoinRoom, setShowJoinRoom] = useState(true);
    const [getUserCall, setGetUserCall] = useState();
    const [acceptAdmit, setAcceptAdmit] = useState();


    const [loader, setLoder] = useState(false)
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

    const videoRef = useRef(null);

    const toggleFullScreen = () => {
        if (videoRef.current) {
            if (!document.fullscreenElement) {
                videoRef.current.requestFullscreen().catch((err) => {
                    console.error(`Fullscreen error: ${err.message}`);
                });
            } else {
                document.exitFullscreen();
            }
        }
    };

    useEffect(() => {
        socket.on("join-user-call-new-notification", ({ roomId }) => {
            console.log("User asked to join call for room:", roomId.roomId);
            setGetUserCall(roomId.roomId)
        });


        socket.on("accept-join-user-call-new-notification", ({ roomId }) => {
            console.log("User asked to join call for room:", roomId.roomId);
         setAcceptAdmit(roomId.roomId)
 
        });
        return () => {
            socket.off("join-user-call-new-notification");
            socket.off("accept-join-user-call-new-notification");


        };
    }, [socket]);


    const handleAdmitUser = () => {
        setGetUserCall()

        socket.emit("accept-join-user-call", {
            roomId,
        });
    }


   

    return (
        <main>
            {
                loader &&
                <Loader />
            }
            <div className="container">

                <div className="video_call_seciton">
                    {
                        getUserCall &&
                        <div className="admit-view-popup">
                            <p>Some one join call</p>
                            <button onClick={handleAdmitUser}>Admit</button>
                            <button onClick={() => { setGetUserCall() }}>Cancel</button>

                        </div>
                    }
                    <div className="container">
                        <div className="video_call_innner">
                            <div className="video-chat-row">
                                <div className="video_col">
                                    <div className="video_row">
                                        <div
                                            className={`col main-video ${getSocketId == null ? "user-screen-share" : ""
                                                }`}
                                        >
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
                                                />
                                            </div>
                                        </div>
                                        {/* remote videos other user videos*/}

                                        {Object.entries(remoteUsers).map(([id, stream]) => (
                                            <>
                                                {
                                                    acceptAdmit &&

                                                    <div key={id}
                                                        className={`col ${id === getSocketId ? "screen-share" : ""
                                                            }`}
                                                    >
                                                        <div className="icons">
                                                            <span
                                                                className="full-screen"
                                                                onClick={toggleFullScreen}
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="24"
                                                                    height="24"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    className="feather feather-maximize-2"
                                                                >
                                                                    <polyline points="15 3 21 3 21 9"></polyline>
                                                                    <polyline points="9 21 3 21 3 15"></polyline>
                                                                    <line x1="21" y1="3" x2="14" y2="10"></line>
                                                                    <line x1="3" y1="21" x2="10" y2="14"></line>
                                                                </svg>
                                                            </span>
                                                            <div className="mic">
                                                                {remoteMicStatus[id] === false ? (
                                                                    <AiOutlineAudioMuted />
                                                                ) : (
                                                                    <AiOutlineAudio />
                                                                )}
                                                            </div>
                                                        </div>



                                                        <div className="placeholder_img">
                                                            <video
                                                                key={id}
                                                                autoPlay
                                                                playsInline
                                                                muted={remoteMicStatus[id] === false}
                                                                ref={(videoEl) => {
                                                                    if (videoEl && !videoEl.srcObject) {
                                                                        videoEl.srcObject = stream;
                                                                        videoRef.current = videoEl; // Save the reference
                                                                    }
                                                                }}
                                                            />
                                                        </div>

                                                    </div>
                                                }
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
                                                <ScreenShare
                                                    pcsd={pcsd}
                                                    socket={socket}
                                                    localStream={localStream}
                                                    localVideoRef={localVideoRef}
                                                    roomId={roomId}
                                                    myId={myId}
                                                    setGetSocketId={setGetSocketId}
                                                    setIsScreenSharing={setIsScreenSharing}
                                                    isScreenSharing={isScreenSharing}
                                                />
                                            </div>
                                            <div className="v-cntrl">
                                                <RecordingScreen />
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

            </div>
        </main>
    );
};

export default LiveCall;
