// components/AcceptCompleted.jsx
import React from "react";

const AcceptCompleted = ({
  setShowAcceptComplete,
  setAcceptCompletePermanently,
  showNameData,
  actionType, // "accept" or "complete"
}) => {
  return (
    <div className="parent-recharge-popups">
      <div className="main-recharge-popup">
        <div className="recharge-popup">
          <p>
            Are you sure you want to{" "}
            {actionType === "accept" ? "accept" : "mark as completed"} this{" "}
            {showNameData}?
          </p>
          <div className="button">
            <button onClick={() => setShowAcceptComplete(false)}>Cancel</button>
            <button
              onClick={() => {
                setAcceptCompletePermanently(true);
                setShowAcceptComplete(false);
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

export default AcceptCompleted;
