"use client";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const FillIntake = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    altMobile: "",
    email: "",
    flat: "",
    locality: "",
    city: "",
    state: "",
    country: "",
    pin: "",
    landmark: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const {
      name,
      mobile,
      email,
      flat,
      locality,
      city,
      state,
      country,
      pin,
    } = formData;

    if (
      !name ||
      !mobile ||
      !email ||
      !flat ||
      !locality ||
      !city ||
      !state ||
      !country ||
      !pin
    ) {
      toast.error("Please fill all required fields!");
      return false;
    }

    if (!/^\d{10}$/.test(mobile)) {
      toast.error("Invalid mobile number");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Invalid email address");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/save-address`,
        formData
      );
      toast.success("Address saved successfully!");
      setFormData({
        name: "",
        mobile: "",
        altMobile: "",
        email: "",
        flat: "",
        locality: "",
        city: "",
        state: "",
        country: "",
        pin: "",
        landmark: "",
      });
    } catch (error) {
      toast.error("Error saving address");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="address-outer">
      <div className="container">
        <div className="address-inner">
            <div className="summary-heading">
          <h3>Add New Address</h3>
          </div>
          <div className="card-body">
            <div className="address-form">
          <form onSubmit={handleSubmit}>
            {[
              { label: "Name", name: "name" },
              { label: "Mobile Number", name: "mobile" },
              { label: "Alternative Number", name: "altMobile", required: false },
              { label: "Email", name: "email" },
              { label: "Flat No", name: "flat" },
              { label: "Locality", name: "locality" },
              { label: "City", name: "city" },
              { label: "State", name: "state" },
              { label: "Country", name: "country" },
              { label: "Pincode", name: "pin" },
              { label: "Landmark", name: "landmark", required: false },
            ].map((field) => (
              <div className="form-group" key={field.name}>
                <label>
                  {field.label} {field.required === false ? "" : <span className="required">*</span>}
                </label>
                <input
                  type="text"
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={`Enter ${field.label}`}
                  className="form-input common-input-filed"
                />
              </div>
            ))}

            <div className="form-group form-submit">
              <button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Address"}
              </button>
            </div>
          </form>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FillIntake;
