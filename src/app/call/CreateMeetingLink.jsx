"use client";

import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import MeetingLinkPopup from "../component/MeetingLinkPopup";
import { useEffect, useState } from "react";

export default function CreateMeetingLink() {
  const router = useRouter();
  const [liveLinkPopUp, setLiveLinkPopUp] = useState(false);
  const [liveLink, setLiveLink] = useState(false);
  const [roomJoin, setRoomJoin] = useState("");

  const createMeeting = () => {
    const roomId = uuidv4();
    setLiveLink(roomId);
    setLiveLinkPopUp(true);
  };

  const handleJoinRoom = () => {
    if (roomJoin.trim()) {
      router.push(`${roomJoin.trim()}`);
      setRoomJoin("");
    }
  };

  useEffect(() => {
    if (liveLinkPopUp) {
      document.body.classList.add("live-link-popup");
    } else {
      document.body.classList.remove("live-link-popup");
    }
  }, [liveLinkPopUp]);

  return (
    <section className="meetings-outer">
      <div className="container">
        <div className="meetings-inner">

          <MeetingLinkPopup
            setLiveLinkPopUp={setLiveLinkPopUp}
            liveLink={liveLink}
          />

          <div className="meeting-sec">
            <h1>Video calls and meetings for everyone</h1>
            <p>Connect, collaborate, and celebrate from anywhere.</p>
            <button onClick={createMeeting}>New Meeting</button>
          </div>
          <div className="call-link">
            <input
              type="text"
              placeholder="Enter a code or link"
              onChange={(e) => setRoomJoin(e.target.value)}
              value={roomJoin}
            />
            <button onClick={handleJoinRoom}>Join</button>
          </div>
        </div>
      </div>
    </section>
  );
}
