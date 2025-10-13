import React from "react";
import { useState } from "react";
import AstroLogerList from "./AstroLogerList";
import AstrologerPendingList from "./AstrologerPendingList";

const ApprovalPanel = () => {
  const [approvalStatus, setApprovalStatus] = useState("confirm");

  return (
    <>
      <div className={`astrologer-list-filter inner-btn`}>
       
        <button className={`${approvalStatus == "confirm"?"active":""}`}
          onClick={() => {
            setApprovalStatus("confirm");
          }}
        >
          Confirm
        </button>
         <button className={`${approvalStatus == "confirm"?"":"active"}`}
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
