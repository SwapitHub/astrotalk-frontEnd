import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Loader from "../component/Loader";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import ShowDetailWithdrawRequest from "../component/ShowDetailWithdrawRequest";

const PaymentWithdrawal = () => {
  const astrologerPhone = Cookies.get("astrologer-phone");

  const [form, setForm] = useState({
    name: "",
    upiId: "",
    holderName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    totalACBalance: "",
    balanceRemaining: "",
    remarks: "",
    AstrologerEmail: "",
    adminEmail: "",
    astrologerPhone,
  });

  const [errors, setErrors] = useState({});
  const [withdrawals, setWithdrawals] = useState([]);
  const [editingId, setEditingId] = useState(null);
 const [addActiveStatus, setAddActiveStatus] = useState(false);
  const [withdrawDataDetail, setWithdrawDataDetail] = useState();
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch withdrawals
  const fetchWithdrawals = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/get-detail-payment-withdrawal/${astrologerPhone}?page=${page}&limit=3`
      );
      const {
        data,
        currentPage,
        totalPages,
        totalItems,
        hasNextPage,
        hasPrevPage,
      } = res.data;

      setWithdrawals(data);
      setCurrentPage(currentPage);
      setTotalPages(totalPages);
      setTotalItems(totalItems);
      setHasNextPage(hasNextPage);
      setHasPrevPage(hasPrevPage);
    } catch (err) {
      console.error("Failed to fetch withdrawals:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals(currentPage);
  }, [currentPage]);

  // Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Name is required";
    if (!form.upiId) newErrors.upiId = "UPI ID is required";
    if (!form.holderName) newErrors.holderName = "Holder Name is required";
    if (!form.bankName) newErrors.bankName = "Bank Name is required";
    if (!form.accountNumber)
      newErrors.accountNumber = "Account Number is required";
    if (!form.ifscCode) newErrors.ifscCode = "IFSC Code is required";
    if (!form.adminEmail) newErrors.adminEmail = "Admin Email is required";
    if (!form.AstrologerEmail)
      newErrors.AstrologerEmail = "Astrologer Email is required";
    if (!form.balanceRemaining)
      newErrors.balanceRemaining = "Remaining balance is required";
    if (!form.totalACBalance)
      newErrors.totalACBalance = "Total AC Balance is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Reset form
  const resetForm = () => {
    setForm({
      name: "",
      upiId: "",
      holderName: "",
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      totalACBalance: "",
      balanceRemaining: "",
      remarks: "",
      AstrologerEmail: "",
      adminEmail: "",
      astrologerPhone,
    });
    setEditingId(null);
    setErrors({});
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    setLoading(true);
    try {
      if (editingId) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}/put-payment-withdrawal/${editingId}`,
          form
        );
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}/post-payment-withdrawal`,
          form
        );
      }
      fetchWithdrawals(currentPage);
      resetForm();
    } catch (err) {
      console.error("Submission error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Pagination handlers
  const handleNextPage = () => {
    if (hasNextPage && !loading) setCurrentPage((prev) => prev + 1);
  };
  const handlePrevPage = () => {
    if (hasPrevPage && !loading) setCurrentPage((prev) => prev - 1);
  };

  return (
    <>
      {addActiveStatus && (
        <ShowDetailWithdrawRequest
          setAddActiveStatus={setAddActiveStatus}
          withdrawDataDetail={withdrawDataDetail}
        />
      )}
    
    <div className="payment-withdrawal-outer">
      {loading && <Loader />}
      <h1>Payment Withdrawal</h1>

      {/* === Form === */}
      <div className="admin-form-box">
        <form onSubmit={handleSubmit} className="form">
          <div className="UPI-details">
            <h2>UPI Details</h2>
            <div className="form-field">
              <label>Name user (UPI)</label>
              <input
                className="common-input-filed"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
              />
              {errors.name && <p className="error">{errors.name}</p>}
            </div>

            <div className="form-field">
              <label>UPI ID</label>
              <input
                className="common-input-filed"
                type="text"
                name="upiId"
                value={form.upiId}
                onChange={handleChange}
              />
              {errors.upiId && <p className="error">{errors.upiId}</p>}
            </div>
          </div>

          <div className="Account-detail">
            <h2>Account Details</h2>

            <div className="form-field">
              <label>Account Holder Name</label>
              <input
                className="common-input-filed"
                type="text"
                name="holderName"
                value={form.holderName}
                onChange={handleChange}
              />
              {errors.holderName && (
                <p className="error">{errors.holderName}</p>
              )}
            </div>

            <div className="form-field">
              <label>Bank Name</label>
              <input
                className="common-input-filed"
                type="text"
                name="bankName"
                value={form.bankName}
                onChange={handleChange}
              />
              {errors.bankName && <p className="error">{errors.bankName}</p>}
            </div>

            <div className="form-field">
              <label>Account Number</label>
              <input
                className="common-input-filed"
                type="text"
                name="accountNumber"
                value={form.accountNumber}
                onChange={handleChange}
              />
              {errors.accountNumber && (
                <p className="error">{errors.accountNumber}</p>
              )}
            </div>

            <div className="form-field">
              <label>Total AC Balance</label>
              <input
                className="common-input-filed"
                type="number"
                name="totalACBalance"
                value={form.totalACBalance}
                onChange={handleChange}
              />
              {errors.totalACBalance && (
                <p className="error">{errors.totalACBalance}</p>
              )}
            </div>

            <div className="form-field">
              <label>Remaining Balance</label>
              <input
                className="common-input-filed"
                type="number"
                name="balanceRemaining"
                value={form.balanceRemaining}
                onChange={handleChange}
              />
              {errors.totalACBalance && (
                <p className="error">{errors.balanceRemaining}</p>
              )}
            </div>

            <div className="form-field">
              <label>IFSC Code</label>
              <input
                className="common-input-filed"
                type="text"
                name="ifscCode"
                value={form.ifscCode}
                onChange={handleChange}
              />
              {errors.ifscCode && <p className="error">{errors.ifscCode}</p>}
            </div>

            <div className="form-field">
              <label>Your Email</label>
              <input
                className="common-input-filed"
                type="email"
                name="AstrologerEmail"
                value={form.AstrologerEmail}
                onChange={handleChange}
                placeholder="Enter your Email"
              />
              {errors.adminEmail && (
                <p className="error">{errors.AstrologerEmail}</p>
              )}
            </div>

            <div className="form-field">
              <label>Admin Email</label>
              <input
                className="common-input-filed"
                type="email"
                name="adminEmail"
                value={form.adminEmail}
                onChange={handleChange}
                placeholder="Enter admin Email"
              />
              {errors.adminEmail && (
                <p className="error">{errors.adminEmail}</p>
              )}
            </div>

            <div className="form-field">
              <label>Remarks</label>
              <input
                className="common-input-filed"
                type="text"
                name="remarks"
                value={form.remarks}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit">{editingId ? "Update" : "Submit"}</button>
            {editingId && (
              <button type="button" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* === Table === */}
      <div className="bottom-table">
        <h2>All Withdrawals</h2>
        <div className="outer-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>UPI ID</th>
                <th>Holder Name</th>
                <th>Bank</th>
                <th>Account No</th>
                <th>Date</th>
                <th>WithDraw Request Status</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals?.length === 0 ? (
                <tr>
                  <td colSpan="13">No entries found.</td>
                </tr>
              ) : (
                withdrawals?.map((w) => (
                  <tr key={w._id}>
                    <td>{w.name}</td>
                    <td>{w.upiId}</td>
                    <td>{w.holderName}</td>
                    <td>{w.bankName}</td>
                    <td>{w.accountNumber}</td>
                    <td>{new Date(w.createdAt).toLocaleString()}</td>
                    <td>
                     <span className="text-before-btn">{w.status}</span>


                      <button
                        className="delete-btn"
                        onClick={() => {
                          setWithdrawDataDetail(w);
                          setAddActiveStatus(true);
                        }}
                      >
                        <MdOutlineRemoveRedEye />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* === Pagination === */}
      <div className="pagination">
        <button onClick={handlePrevPage} disabled={!hasPrevPage || loading}>
          {loading && hasPrevPage ? "Loading..." : "Previous"}
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={!hasNextPage || loading}>
          {loading && hasNextPage ? "Loading..." : "Next"}
        </button>
      </div>
    </div>
    </>
  );
};

export default PaymentWithdrawal;
