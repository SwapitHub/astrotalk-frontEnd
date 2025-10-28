import React from "react";

const AcceptPopUp = ({ setShowAccept, setAcceptPermanently, showNameData }) => {
  return (
    <div className="parent-recharge-popups">
      <div className="main-recharge-popup">
        <div className="recharge-popup">
          <p>Are you sure you want to Accept this {showNameData}?</p>
          <div className="button">
            <button onClick={() => setShowAccept(false)}>Cancel</button>
            <button
              onClick={() => {
                setAcceptPermanently(true);
                setShowAccept(false);
              }}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcceptPopUp;
