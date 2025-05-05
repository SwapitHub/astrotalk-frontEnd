"use client";

import { useRouter } from "next/navigation";


const EndChatPopUp = ({ setShowEndChat, onCloseEndChat, setShowRating }) => {
  const router = useRouter();
  const handleConfirmEndChat = async () => {
    try {
      setShowEndChat(false);
      setShowRating(true)
      await onCloseEndChat(); // properly wait for the async logic
      // router.push("/"); // redirect to the root route
    } catch (error) {
      console.error("Error ending chat:", error);
    }
  };


  return (
    <div className="parent-recharge-popup">
      <div className="main-recharge-popup">
        <div className="recharge-popup">
          <h3>End Chat</h3>
          <p>Are you sure you want to End Chat?</p>
          <div className="button">
            <button onClick={() => setShowEndChat(false)}>Cancel</button>
            <button onClick={handleConfirmEndChat}>OK</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EndChatPopUp;
