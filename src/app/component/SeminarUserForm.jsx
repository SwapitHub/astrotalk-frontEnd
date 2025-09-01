import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import axios from "axios";

const SeminarUserForm = ({ setToggleSlideMobile, NewlySeminarList_id }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Validate before submit
  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    return newErrors;
  };

  // ✅ Submit form
  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/post-user-registrations-seminar`,
        {
          userName: formData.name,
          userEmail: formData.email,
          astrologer_id: NewlySeminarList_id,
        }
      );

      if (res.data.success) {
        setToggleSlideMobile(false);
      } else {
        alert(res.data.error || "Something went wrong");
      }
    } catch (error) {
      console.error("API Error:", error);
      alert("Server error, please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-seminar-form">
      <span className="close-icon" onClick={() => setToggleSlideMobile(false)}>
        <IoClose />
      </span>

      <div className="form-field">
        <div className="label-content">
          <label>Enter your name:</label>
        </div>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="common-input-filed"
        />
        {errors.name && <span style={{ color: "red" }}>{errors.name}</span>}
      </div>

      <div className="form-field">
        <div className="label-content">
          <label>Enter your email:</label>
        </div>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="common-input-filed"
        />
        {errors.email && <span style={{ color: "red" }}>{errors.email}</span>}
      </div>

      <button onClick={handleSubmit} disabled={loading} className="submit-btn">
        {loading ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
};

export default SeminarUserForm;
