import React, { useEffect, useState } from 'react'
import secureLocalStorage from 'react-secure-storage';
import io from "socket.io-client";

// Initialize socket connection
const socket = io(process.env.NEXT_PUBLIC_WEBSITE_URL, {
  transports: ["websocket"],
  reconnection: true,
});

const RequestPopUp = ({setIsLoadingRequest}) => {
    const [timer, setTimer] = useState(1); 

    useEffect(() => {
      if (timer === 0) return; 
  
      const interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
  
      return () => clearInterval(interval); 
    }, [timer]);

    const handleUpdateNotification =()=>{
      // console.log("jhgjhgjhghg============");
      
      // socket.emit("astrologer-chat-requestStatus", { requestStatus: false });
      // socket.emit("astrologer-chat-requestPaidChat", { requestStatus: 1 });
      secureLocalStorage.setItem("IsLoadingRequestStore", false);
      setIsLoadingRequest(false);

    }

  return (
    <section className="countdown-outer">
    <div className="container">
        <div className="countdown-inner">
          <span className="close-icon"><button onClick={handleUpdateNotification}>Close X</button></span>
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
  )
}

export default RequestPopUp