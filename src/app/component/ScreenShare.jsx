import React, { useRef, useState,useEffect } from "react";
import {
  MdOutlineScreenShare,
  MdOutlineStopScreenShare,
} from "react-icons/md";

const ScreenShare = ({
pcsd,
socket,
localStream,
localVideoRef,
roomId,
myId
}) => {
  const [isScreenSharing, setIsScreenSharing] = useState(false);
    const screenTrackRef = useRef(null);

   const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const screenTrack = screenStream.getVideoTracks()[0];
      screenTrackRef.current = screenTrack;
  
      // Replace in all peer connections
      Object.values(pcsd.current).forEach((pc) => {
        const sender = pc.getSenders().find((s) => s.track?.kind === "video");
        if (sender) sender.replaceTrack(screenTrack);
      });
  
      // Show my preview
      localVideoRef.current.srcObject = screenStream;
  
      socket.emit("start-screen-share", { roomId, userId: myId });
      screenTrack.onended = stopScreenShare;
      setIsScreenSharing(true);
    } else {
      stopScreenShare();
    }
  };
  
  
    const stopScreenShare = () => {
      if (screenTrackRef.current) {
        screenTrackRef.current.stop();
        screenTrackRef.current = null;
      }
  
      // Revert back to camera video track
      const cameraTrack = localStream.current?.getVideoTracks()[0];
      if (cameraTrack) {
        Object.values(pcsd.current).forEach((pc) => {
          const sender = pc.getSenders().find((s) => s.track?.kind === "video");
          if (sender) sender.replaceTrack(cameraTrack);
        });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream.current;
        }
      }
  
  
      socket.emit("stop-screen-share", { roomId, userId: myId });
      setIsScreenSharing(false);
    };
  
    useEffect(() => {
      socket.on("user-started-screen-share", ({ socketId }) => {
        console.log(`🖥️ User ${socketId} started screen sharing`);
      });
  
      socket.on("user-stopped-screen-share", ({ socketId }) => {
        console.log(`🛑 User ${socketId} stopped screen sharing`);
      });
  
      return () => {
        socket.off("user-started-screen-share");
        socket.off("user-stopped-screen-share");
      };
    }, []);

  return (
    <div onClick={toggleScreenShare}>
      {isScreenSharing ? <MdOutlineStopScreenShare /> : <MdOutlineScreenShare />}
    </div>
  );
};

export default ScreenShare;
