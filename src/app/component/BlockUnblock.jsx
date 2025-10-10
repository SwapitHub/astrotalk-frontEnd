import React from "react";

const BlockUnblock = ({
  setShowBlockUnblock,
  setBlockUnblockPermanently,
  showNameData,
  updateBlockUnblock,
}) => {
  return (
    <div className="parent-recharge-popups">
      <div className="main-recharge-popup">
        <div className="recharge-popup">
          <p>
            Are you sure you want to permanently{" "}
            {updateBlockUnblock ? "Block" : "Unblock"} this {showNameData}?
          </p>
          <div className="button">
            <button onClick={() => setShowBlockUnblock(false)}>Cancel</button>
            <button
              onClick={() => {
                setBlockUnblockPermanently(true);
                setShowBlockUnblock(false);
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

export default BlockUnblock;
