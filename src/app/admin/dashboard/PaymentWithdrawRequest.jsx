import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "@/app/component/Loader";
import { FaCheck, FaSearch } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { toast } from "react-toastify";
import useDebounce from "@/app/hook/useDebounce";
import DeletePopUp from "@/app/component/DeletePopUp";
import AcceptPopUp from "@/app/component/AcceptPopUp";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import ShowDetailWithdrawRequest from "@/app/component/ShowDetailWithdrawRequest";

const PaymentWithdrawRequest = () => {
  let showNameData = "Withdrawal Requests";

  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);
  const [showDelete, setShowDelete] = useState(false);
  const [showAccept, setShowAccept] = useState(false);

  const [deletePermanently, setDeletePermanently] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [acceptPermanently, setAcceptPermanently] = useState(false);
  const [addActiveStatus, setAddActiveStatus] = useState(false);
  const [withdrawDataDetail, setWithdrawDataDetail] = useState();

  const [page, setPage] = useState(1);
  const limit = 3;

  const [totalPages, setTotalPages] = useState(1);

  const fetchWithdrawals = async (search = "") => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/get-all-payment-withdrawal?page=${page}&limit=${limit}&search=${search}`
      );

      setWithdrawals(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch withdrawals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals(debouncedSearchTerm);
  }, [page, debouncedSearchTerm]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm]);

  const handleStatusChange = async (id, newStatus) => {
    console.log(id, newStatus);

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/put-payment-withdrawal/${id}`,
        { status: newStatus }
      );
      fetchWithdrawals();
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error("Astrologer Email is requeued", {
        position: "top-right",
      });
    }
  };

  // ✅ Handle delete confirmation
  useEffect(() => {
    if (selectedUserId && deletePermanently) {
      handleStatusChange(selectedUserId, "rejected");
      setDeletePermanently(false);
      setSelectedUserId(null);
    }
  }, [deletePermanently]);

  // ✅ Handle accept confirmation
  useEffect(() => {
    if (selectedUserId && acceptPermanently) {
      handleStatusChange(selectedUserId, "approved");
      setAcceptPermanently(false);
      setSelectedUserId(null);
    }
  }, [acceptPermanently]);

  const goToNextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const goToPrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  
  return (
    <>
      {showDelete && (
        <DeletePopUp
          setShowDelete={setShowDelete}
          setDeletePermanently={setDeletePermanently}
          showNameData={showNameData}
        />
      )}
      {showAccept && (
        <AcceptPopUp
          setShowAccept={setShowAccept}
          setAcceptPermanently={setAcceptPermanently}
          showNameData={showNameData}
        />
      )}
      
      {addActiveStatus && (
        <ShowDetailWithdrawRequest
          setAddActiveStatus={setAddActiveStatus}
          withdrawDataDetail={withdrawDataDetail}
        />
      )}

      <div className="withdrawal-request-outer">
        <h1>Withdrawal Requests</h1>

        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="outer-table">
              <div className="search-box-top-btn">
                <div className="search-box-filed">
                  <input
                    type="search"
                    placeholder="Search name or mobile..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="search-button-filed">
                  <button
                    type="button"
                    onClick={() => fetchWithdrawals(searchTerm)}
                  >
                    <FaSearch />
                  </button>
                </div>
              </div>
              <table
                border="1"
                cellPadding="10"
                style={{ width: "100%", textAlign: "left" }}
              >
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>UPI ID</th>
                    <th>Account Number</th>
                    <th>Bank Name</th>
                    {/* <th>Total AC Balance</th> */}
                    {/* <th>Remarks</th> */}
                    {/* <th>Balance Remaining</th> */}
                    <th>IFSC code</th>
                    {/* <th>WithDraw Request Status</th> */}
                    {/* <th>Astrologer Email id</th> */}
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawals.length === 0 ? (
                    <tr>
                      <td colSpan="9">No withdrawal requests.</td>
                    </tr>
                  ) : (
                    withdrawals.map((w) => (
                      <tr key={w._id}>
                        <td>{w.name}</td>
                        <td>{w.upiId}</td>
                        <td>{w.accountNumber}</td>
                        <td>{w.bankName}</td>
                        {/* <td>{w.totalACBalance}</td> */}
                        {/* <td>{w.remarks}</td> */}
                        {/* <td>{w.balanceRemaining}</td> */}
                        <td>{w.ifscCode}</td>
                        {/* <td>{w.status}</td> */}
                        {/* <td>{w.AstrologerEmail}</td> */}
                        <td>{new Date(w.createdAt).toLocaleString()}</td>
                        <td>
                          <div className="edit-delete-btn">
                          {w.status === "pending" ? (
                            <>
                              <button className="delete-btn"
                                onClick={() => {
                                  setSelectedUserId(w._id);
                                  setShowAccept(true);
                                }}
                              >
                                <FaCheck />
                              </button>
                              <button className="delete-btn"
                                onClick={() => {
                                  setSelectedUserId(w._id);
                                  setShowDelete(true);
                                }}
                              >
                                <ImCross />
                              </button>
                            </>
                          ) : (
                            <span className="text-before-btn">
                              {w.status}
                            </span>
                          )}
                          <button className="delete-btn"
                            onClick={() => {
                              setWithdrawDataDetail(w);
                              setAddActiveStatus(true);
                            }}
                          >
                            <MdOutlineRemoveRedEye />
                          </button>
                          </div>
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
                 Prev
              </button>

              <span style={{ margin: "0 10px" }}>
                Page {page} of {totalPages}
              </span>

              <button onClick={goToNextPage} disabled={page >= totalPages}>
                Next 
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default PaymentWithdrawRequest;
