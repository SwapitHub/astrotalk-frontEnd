import React from "react";

const ShowDetailWithdrawRequest = ({
  setAddActiveStatus,
  withdrawDataDetail,
}) => {
  return (
    <div className="astro-detail-main-view">
      <span
        className="close"
        onClick={() => {
          setAddActiveStatus(false);
        }}
      >
        X
      </span>

      <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
        Astrologer Withdrawal Requests Details
      </h2>

      {/* User Table */}

      <div className="profile-table">
        <div className="inner-profile-table">
          <div className="common-profile">
            <div className="name"> Name</div>
            <div className="input-outer">{withdrawDataDetail?.name}</div>
          </div>
          <div className="common-profile">
            <div className="mobile"> Mobile Number</div>
            <div className="input-outer">
              {withdrawDataDetail?.astrologerPhone}
            </div>
          </div>
          <div className="common-profile">
            <div className="mobile">Email ID</div>
            <div className="input-outer">
              {withdrawDataDetail?.AstrologerEmail}
            </div>
          </div>
          <div className="common-profile">
            <div className="mobile">Admin Email ID</div>
            <div className="input-outer">{withdrawDataDetail?.adminEmail}</div>
          </div>
          <div className="common-profile">
            <div className="mobile">UPI ID</div>
            <div className="input-outer">{withdrawDataDetail?.upiId}</div>
          </div>
          <div className="common-profile">
            <div className="mobile">Account Number</div>
            <div className="input-outer">
              {withdrawDataDetail?.accountNumber}
            </div>
          </div>

          <div className="common-profile">
            <div className="balance">Balance Remaining</div>
            <div className="input-outer">
              ₹ {withdrawDataDetail?.balanceRemaining}
            </div>
          </div>
          <div className="common-profile">
            <div className="date-of-birth">Bank Name</div>
            <div className="input-outer"> {withdrawDataDetail?.bankName}</div>
          </div>
          <div className="common-profile">
            <div className="gender">HolderName</div>
            <div className="input-outer"> {withdrawDataDetail?.holderName}</div>
          </div>
          <div className="common-profile">
            <div className="language">IFSC Code</div>
            <div className="input-outer"> {withdrawDataDetail?.ifscCode}</div>
          </div>
          <div className="common-profile">
            <div className="placeOfBorn">Remarks</div>
            <div className="input-outer">{withdrawDataDetail?.remarks}</div>
          </div>
          <div className="common-profile">
            <div className="placeOfBorn">Total Balance</div>
            <div className="input-outer">
             ₹  {withdrawDataDetail?.totalACBalance}
            </div>
          </div>
          <div className="common-profile">
            <div className="date-time">Date and Time</div>
            <div className="input-outer">
              {" "}
              {withdrawDataDetail?.createdAt &&
                new Date(withdrawDataDetail?.createdAt).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowDetailWithdrawRequest;
