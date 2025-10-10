import React from "react";
import { useState } from "react";
import AstroLogerList from "./AstroLogerList";
import AstrologerPendingList from "./AstrologerPendingList";

const ApprovalPanel = () => {
  const [approvalStatus, setApprovalStatus] = useState("confirm");

  return (
    <>
      <div className={`inner-btn ${approvalStatus == "confirm"?"active":""}`}>
       
        <button
          onClick={() => {
            setApprovalStatus("confirm");
          }}
        >
          Confirm
        </button>
         <button
          onClick={() => {
            setApprovalStatus("pending");
          }}
        >
          Pending
        </button>
      </div>
      {approvalStatus == "confirm" ? (
        <AstroLogerList />
      ) : (
        <AstrologerPendingList />
      )}
    </>
  );
};

export default ApprovalPanel;
