import axios from "axios";
import React, { useState } from "react";

const CancelOrderPopUp = ({ cancelOrder, setCancelOrder, setLoading, fetchTransactions }) => {
  const [cancelReason, setCancelReason] = useState("");
  const [cancelReasonError, setCancelReasonError] = useState("");
  const updateOrderCancelStatus = async (orderId, status, reason) => {
    setLoading(true);
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/update-any-field-payment-shop/${orderId}`,
        {
          product_cancel_order: status,
          product_cancel_order_reason: reason, // Pass the cancel reason here
        }
      );

      if (res?.status === 200) {
        fetchTransactions();
        setCancelOrder({ orderStatus: false, order_id: null });
        setCancelReason("");
      }
    } catch (err) {
      console.log(err, "update order cancel api error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="cancel-order-reason">
      <div className="cancel-order-reason-inner">
     
      <h2>Please provide reason for canceling the order</h2>
      <span
        className="close"
        onClick={() => {
          setCancelOrder({ orderStatus: false });
        }}
      ></span>
      <input
        className="common-input-filed"
        type="text"
        value={cancelReason}
        onChange={(e) => {
          setCancelReason(e.target.value);
          setCancelReasonError("");
        }}
        placeholder="Enter reason for cancellation"
      />
      {cancelReasonError && (
        <p style={{ color: "red", marginTop: "4px" }}>{cancelReasonError}</p>
      )}
      <button
        onClick={() => {
          if (!cancelReason.trim()) {
            setCancelReasonError("Cancellation reason is required.");
            return;
          }

          if (cancelReason.trim().length < 5) {
            setCancelReasonError("Reason must be at least 5 characters.");
            return;
          }

          updateOrderCancelStatus(cancelOrder?.order_id, true, cancelReason);
        }}
      >
        Submit
      </button>
    </div>
     </div>
  );
};

export default CancelOrderPopUp;
