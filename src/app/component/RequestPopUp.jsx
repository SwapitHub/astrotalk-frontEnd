import React, { useEffect, useState } from 'react'

const RequestPopUp = () => {
    const [timer, setTimer] = useState(1); 

    useEffect(() => {
      if (timer === 0) return; 
  
      const interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
  
      return () => clearInterval(interval); 
    }, [timer]);

  return (
    <section className="countdown-outer">
    <div className="container">
        <div className="countdown-inner">
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