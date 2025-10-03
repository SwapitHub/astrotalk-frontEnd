import React from "react";

const DeletePopUp = ({ setShowDelete, setDeletePermanently, showNameData }) => {
  return (
    <div className="parent-recharge-popups">
      <div className="main-recharge-popup">
        <div className="recharge-popup">
          <p>Are you sure you want to permanently delete this {showNameData}?</p>
          <div className="button">
            <button onClick={() => setShowDelete(false)}>Cancel</button>
            <button
              onClick={() => {
                setDeletePermanently(true);
                setShowDelete(false);
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

export default DeletePopUp;
