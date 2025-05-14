import React, { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import io from "socket.io-client";

// Initialize socket connection
const socket = io(process.env.NEXT_PUBLIC_WEBSITE_URL, {
  transports: ["websocket"],
  reconnection: true,
});

const RequestPopUp = ({ setIsLoadingRequest }) => {
  const [timer, setTimer] = useState(1);

  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleCloseNotification = () => {
    // console.log("jhgjhgjhghg============");

    // socket.emit("astrologer-chat-requestStatus", { requestStatus: false });
    socket.emit("astrologer-chat-requestPaidChat", { requestStatus: 2 });
    secureLocalStorage.setItem("IsLoadingRequestStore", false);
    setIsLoadingRequest(false);
  };

   useEffect(() => {
    const handleNewRequestStatusNotification = (data) => {
      console.log("📩 astrologer-requestStatus-new-notification:", data);
if(data.requestStatusData.requestStatus=="1"){

  setIsLoadingRequest(false);
}
      // setNewRequestNotification(data.requestStatusData?.requestStatus);
      // Optionally save to secureLocalStorage if needed
      secureLocalStorage.setItem(
        "requestStatusNotifications",
        data.requestStatusData?.requestStatus
      );

    };

    // Add listeners
    // socket.on(
    //   "astrologer-requestStatus-new-notification",
    //   handleNewRequestStatusNotification
    // );
    socket.on(
      "astrologer-requestPaidChat-new-notification",
      handleNewRequestStatusNotification
    );

    // Clean up both listeners on unmount
    return () => {
      socket.off(
        "astrologer-requestStatus-new-notification",
        handleNewRequestStatusNotification
      );
      socket.off(
        "astrologer-requestPaidChat-new-notification",
        handleNewRequestStatusNotification
      );
    };
  }, []);
  return (
    <section className="countdown-outer">
      <div className="container">
        <div className="countdown-inner">
          <span className="close-icon">
            <button onClick={handleCloseNotification}>Close X</button>
          </span>
          <div className="countdown-top-cont">
            <h1>Please wait....</h1>
            <p>The astrologer will connect with you shortly.</p>
          </div>
          <div className="countdown-timer">
            <span className="time-content">Connecting in:</span>
            <div className="timer-sec">
              <span>{timer}s</span>
            </div>
          </div>
          <div className="countdown-bottom-cont">
            <p>If the astrologer does not connect, please try again.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RequestPopUp;
