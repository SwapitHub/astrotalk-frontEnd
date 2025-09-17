import React, { useState, useEffect } from "react";
import axios from "axios";


const PaymentWithdrawal = () => {
  const [form, setForm] = useState({
    name: "",
    upiId: "",
    holderName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    email: ""
  });

  const [errors, setErrors] = useState({});
  const [withdrawals, setWithdrawals] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Fetch all entries
  const fetchWithdrawals = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/get-all-payment-withdrawal`);
      setWithdrawals(res.data);
    } catch (err) {
      console.error("Failed to fetch withdrawals:", err.message);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

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
    if (!form.accountNumber) newErrors.accountNumber = "Account Number is required";
    if (!form.ifscCode) newErrors.ifscCode = "IFSC Code is required";
    if (!form.email) newErrors.email = "Email is required";

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
        await axios.put(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/put-payment-withdrawal/${editingId}`, form);
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/post-payment-withdrawal`, form);
      }
      fetchWithdrawals();
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
      await axios.delete(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/delete-payment-withdrawal/${id}`);
      fetchWithdrawals();
    } catch (err) {
      console.error("Deletion error:", err.message);
    }
  };

  return (
    <div className="container">
      <h1>Payment Withdrawal</h1>

      {/* === Form === */}
      <form onSubmit={handleSubmit} className="form">
        <h2>{editingId ? "Edit Details" : "Enter Details"}</h2>

        <div className="form-group">
          <label>Name (UPI)</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label>UPI ID</label>
          <input type="text" name="upiId" value={form.upiId} onChange={handleChange} />
          {errors.upiId && <p className="error">{errors.upiId}</p>}
        </div>

        <div className="form-group">
          <label>Account Holder Name</label>
          <input type="text" name="holderName" value={form.holderName} onChange={handleChange} />
          {errors.holderName && <p className="error">{errors.holderName}</p>}
        </div>

        <div className="form-group">
          <label>Bank Name</label>
          <input type="text" name="bankName" value={form.bankName} onChange={handleChange} />
          {errors.bankName && <p className="error">{errors.bankName}</p>}
        </div>

        <div className="form-group">
          <label>Account Number</label>
          <input type="text" name="accountNumber" value={form.accountNumber} onChange={handleChange} />
          {errors.accountNumber && <p className="error">{errors.accountNumber}</p>}
        </div>

        <div className="form-group">
          <label>IFSC Code</label>
          <input type="text" name="ifscCode" value={form.ifscCode} onChange={handleChange} />
          {errors.ifscCode && <p className="error">{errors.ifscCode}</p>}
        </div>

        <div className="form-group">
          <label>Admin Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Enter admin email" />
          {errors.ifscCode && <p className="error">{errors.email}</p>}
        </div>

        <div className="form-actions">
          <button type="submit">{editingId ? "Update" : "Submit"}</button>
          {editingId && <button type="button" onClick={resetForm}>Cancel</button>}
        </div>


      </form>

      {/* === Table === */}
      <h2>All Withdrawals</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>UPI ID</th>
            <th>Holder</th>
            <th>Bank</th>
            <th>Account #</th>
            <th>IFSC</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {withdrawals.length === 0 ? (
            <tr>
              <td colSpan="7">No entries found.</td>
            </tr>
          ) : (
            withdrawals.map((w) => (
              <tr key={w._id}>
                <td>{w.name}</td>
                <td>{w.upiId}</td>
                <td>{w.holderName}</td>
                <td>{w.bankName}</td>
                <td>{w.accountNumber}</td>
                <td>{w.ifscCode}</td>
                <td>
                  <button onClick={() => handleEdit(w)}>Edit</button>
                  <button onClick={() => handleDelete(w._id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>


    </div>
  );
};

export default PaymentWithdrawal;
