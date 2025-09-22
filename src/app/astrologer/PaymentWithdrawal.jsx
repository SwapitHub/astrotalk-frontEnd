import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Loader from "../component/Loader";

const PaymentWithdrawal = () => {
  const astrologerPhone = Cookies.get("astrologer-phone");
  console.log(astrologerPhone);

  const [form, setForm] = useState({
    name: "",
    upiId: "",
    holderName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    adminEmail: "",
    astrologerPhone,
  });

  const [errors, setErrors] = useState({});
  const [withdrawals, setWithdrawals] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch withdrawals with pagination
  const fetchWithdrawals = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/get-detail-payment-withdrawal/${astrologerPhone}?page=${page}&limit=2`
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

  // Input change handler
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Name is required";
    if (!form.upiId) newErrors.upiId = "UPI ID is required";
    if (!form.holderName) newErrors.holderName = "Holder Name is required";
    if (!form.bankName) newErrors.bankName = "Bank Name is required";
    if (!form.accountNumber)
      newErrors.accountNumber = "Account Number is required";
    if (!form.ifscCode) newErrors.ifscCode = "IFSC Code is required";
    if (!form.adminEmail) newErrors.adminEmail = "adminEmail is required";

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
      adminEmail: "",
    });
    setEditingId(null);
    setErrors({});
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

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
    }
  };

  // Edit
  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({
      name: item.name,
      upiId: item.upiId,
      holderName: item.holderName,
      bankName: item.bankName,
      accountNumber: item.accountNumber,
      ifscCode: item.ifscCode,
    });
    setErrors({});
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/delete-payment-withdrawal/${id}`
      );
      fetchWithdrawals(currentPage);
    } catch (err) {
      console.error("Deletion error:", err.message);
    }
  };

  const handleNextPage = () => {
    if (hasNextPage && !loading) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (hasPrevPage && !loading) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="payment-withdrawal-outer">
      {loading && <Loader />}
      <h1>Payment Withdrawal</h1>

      {/* === Form === */}
      <div className="admin-form-box">
      <form onSubmit={handleSubmit} className="form">
        <h2>{editingId ? "Edit Details" : "Enter Details"}</h2>
        <div className="form-field">
          <div className="label-content">
            <label>Name (UPI)</label>
          </div>
          <input className="common-input-filed"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>

        <div className="form-field">
          <div className="label-content">
          <label>UPI ID</label>
          </div>
          <input className="common-input-filed"
            type="text"
            name="upiId"
            value={form.upiId}
            onChange={handleChange}
          />
          {errors.upiId && <p className="error">{errors.upiId}</p>}
        </div>

       <div className="form-field">
          <div className="label-content">
          <label>Account Holder Name</label>
          </div>
          <input className="common-input-filed"
            type="text"
            name="holderName"
            value={form.holderName}
            onChange={handleChange}
          />
          {errors.holderName && <p className="error">{errors.holderName}</p>}
        </div>

        <div className="form-field">
          <div className="label-content">
          <label>Bank Name</label>
          </div>
          <input className="common-input-filed"
            type="text"
            name="bankName"
            value={form.bankName}
            onChange={handleChange}
          />
          {errors.bankName && <p className="error">{errors.bankName}</p>}
        </div>

        <div className="form-field">
          <div className="label-content">
          <label>Account Number</label>
          </div>
          <input className="common-input-filed"
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
          <div className="label-content">
          <label>IFSC Code</label>
          </div>
          <input className="common-input-filed"
            type="text"
            name="ifscCode"
            value={form.ifscCode}
            onChange={handleChange}
          />
          {errors.ifscCode && <p className="error">{errors.ifscCode}</p>}
        </div>

        <div className="form-field">
          <div className="label-content">
          <label>Admin adminEmail</label>
          </div>
          <input className="common-input-filed"
            type="email"
            name="adminEmail"
            value={form.adminEmail}
            onChange={handleChange}
            placeholder="Enter admin adminEmail"
          />
          {errors.adminEmail && <p className="error">{errors.adminEmail}</p>}
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
              <th>Holder</th>
              <th>Bank</th>
              <th>Account #</th>
              <th>IFSC</th>
              <th>Date and time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {withdrawals?.length === 0 ? (
              <tr>
                <td colSpan="7">No entries found.</td>
              </tr>
            ) : (
              withdrawals?.map((w) => (
                <tr key={w._id}>
                  <td>{w.name}</td>
                  <td>{w.upiId}</td>
                  <td>{w.holderName}</td>
                  <td>{w.bankName}</td>
                  <td>{w.accountNumber}</td>
                  <td>{w.ifscCode}</td>
                  <td>{new Date(w.createdAt).toLocaleString()}</td>
                  <td>{w.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      </div>
      {/* === Pagination Controls === */}
      {/* === Pagination Controls === */}
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
  );
};

export default PaymentWithdrawal;
