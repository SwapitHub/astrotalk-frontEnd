import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "@/app/component/Loader";

const PaymentWithdrawRequest = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(false);
console.log(withdrawals,"withdrawals");

  const [page, setPage] = useState(1);
  const limit = 3;

  const [totalPages, setTotalPages] = useState(1);

  const fetchWithdrawals = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/get-all-payment-withdrawal?page=${page}&limit=${limit}`
      );
console.log(res);

      setWithdrawals(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch withdrawals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, [page]); // refetch when page changes

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/put-payment-withdrawal/${id}`,
        { status: newStatus }
      );
      fetchWithdrawals(); // refresh current page
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const goToNextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const goToPrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  return (
    <div className="withdrawal-request-outer">
      <h1>Withdrawal Requests</h1>

      {loading ? (
        <Loader/>
      ) : (
        <>
        <div className="outer-table">
          <table border="1" cellPadding="10" style={{ width: "100%", textAlign: "left" }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>UPI</th>
                <th>Holder</th>
                <th>Bank</th>
                <th>Account</th>
                <th>IFSC</th>
                <th>Status</th>
                <th>Requested At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.length === 0 ? (
                <tr><td colSpan="9">No withdrawal requests.</td></tr>
              ) : (
                withdrawals.map((w) => (
                  <tr key={w._id}>
                    <td>{w.name}</td>
                    <td>{w.upiId}</td>
                    <td>{w.holderName}</td>
                    <td>{w.bankName}</td>
                    <td>{w.accountNumber}</td>
                    <td>{w.ifscCode}</td>
                    <td style={{ textTransform: "capitalize" }}>{w.status}</td>
                    <td>{new Date(w.createdAt).toLocaleString()}</td>
                    <td>
                      {w.status === "pending" ? (
                        <>
                          <button onClick={() => handleStatusChange(w._id, "approved")}>
                            Approve
                          </button>
                          <button onClick={() => handleStatusChange(w._id, "rejected")}>
                            Reject
                          </button>
                        </>
                      ) : (
                        <span>{w.status}</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
</div>
          {/* Pagination Controls */}
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <button onClick={goToPrevPage} disabled={page <= 1}>
              ◀ Prev
            </button>

            <span style={{ margin: "0 10px" }}>
              Page {page} of {totalPages}
            </span>

            <button onClick={goToNextPage} disabled={page >= totalPages}>
              Next ▶
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentWithdrawRequest;
