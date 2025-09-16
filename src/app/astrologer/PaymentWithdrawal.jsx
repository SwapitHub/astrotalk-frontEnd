import React from "react";

const PaymentWithdrawal = () => {
  return (
    <div className="Payment-withdrawal">
      <h1>Account Details</h1>
      <div className="Payment-withdrawal-main">
        <h2>UPI Detail</h2>
        <div className="name">
          <label>Name</label>
          <input type="text" />
        </div>
        <div className="name">
          <label>UPI Id</label>
          <input type="text" />
        </div>
      </div>

      <div className="Payment-withdrawal-main">
        <h2>Bank Detail</h2>
        <div className="name">
          <label>Holder Name</label>
          <input type="text" />
        </div>
        <div className="name">
          <label>Bank Name</label>
          <input type="text" />
        </div>
        <div className="name">
          <label>Account Number</label>
          <input type="text" />
        </div>
        <div className="name">
          <label>IFSC Code</label>
          <input type="text" />
        </div>
      </div>
    </div>
  );
};

export default PaymentWithdrawal;
