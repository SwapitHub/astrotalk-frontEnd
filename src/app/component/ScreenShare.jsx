import React from "react";
import { useState } from "react";
import { MdOutlineScreenShare, MdOutlineStopScreenShare } from "react-icons/md";

const ScreenShare = ({pcsd, localVideoRef}) => {
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });

        const screenTrack = screenStream.getVideoTracks()[0];

        // Replace current video track with screen track
        Object.values(pcsd.current).forEach((pc) => {
          const senders = pc.getSenders();
          const videoSender = senders.find((s) => s.track?.kind === "video");
          if (videoSender) {
            videoSender.replaceTrack(screenTrack);
          }
        });

        // Show on local video
        localVideoRef.current.srcObject = screenStream;

        screenTrack.onended = () => {
          stopScreenShare(); // if user clicks "Stop sharing" from browser
        };

        setIsScreenSharing(true);
      } catch (err) {
        console.error("❌ Screen share failed:", err);
      }
    } else {
      stopScreenShare();
      console.log("true======");
      
    }
  };

  const stopScreenShare = async () => {
    const videoTrack = (
      await navigator.mediaDevices.getUserMedia({
        video: true,
      })
    ).getVideoTracks()[0];

    Object.values(pcsd.current).forEach((pc) => {
      const senders = pc.getSenders();
      const videoSender = senders.find((s) => s.track?.kind === "video");
      if (videoSender) {
        videoSender.replaceTrack(videoTrack);
      }
    });

    // Replace back to camera
    localStream.current.getVideoTracks().forEach((t) => t.stop());
    localStream.current = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: voiceMedia,
    });
    localVideoRef.current.srcObject = localStream.current;

    setIsScreenSharing(false);
  };

  return (
    <div onClick={toggleScreenShare}>
      {isScreenSharing ? <MdOutlineStopScreenShare /> : <MdOutlineScreenShare />}
    </div>
  );
};

export default ScreenShare;
