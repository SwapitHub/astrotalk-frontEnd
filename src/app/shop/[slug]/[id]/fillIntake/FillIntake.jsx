"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";

const FillIntake = () => {
  const router = useRouter();
  const params = useParams();
  const userMobile = Cookies.get("userMobile");

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
  const [formErrors, setFormErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false); 

  useEffect(() => {
    if (!userMobile) return;

    const fetchAddress = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}/get-address/${userMobile}`
        );

        if (res?.data?.data) {
          setFormData(res.data.data);
          setIsEditMode(true); // Switch to edit mode
          
        }
      } catch (error) {
        // No address exists for this user
        console.log("No existing address found");
      }
    };

    fetchAddress();
  }, [userMobile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errors = {};
    const { name, mobile, email, flat, locality, city, state, country, pin } = formData;

    if (!name) errors.name = "Name is required";
    if (!mobile) errors.mobile = "Mobile number is required";
    else if (!/^\d{10}$/.test(mobile)) errors.mobile = "Mobile number must be 10 digits";

    if (!email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Invalid email address";

    if (!flat) errors.flat = "Flat No is required";
    if (!locality) errors.locality = "Locality is required";
    if (!city) errors.city = "City is required";
    if (!state) errors.state = "State is required";
    if (!country) errors.country = "Country is required";
    if (!pin) errors.pin = "Pincode is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const payload = { ...formData, userMobile }; // Ensure userMobile is included

      let res;
      if (isEditMode) {
        // ✅ Update existing address
        res = await axios.put(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}/update-address/${userMobile}`,
          payload
        );
        toast.success("Address updated successfully!");
      } else {
        // ✅ Save new address
        res = await axios.post(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}/save-address`,
          payload
        );
        toast.success("Address saved successfully!");
      }

      router.push(
        `/shop/${params?.slug}/${params?.id}/orderReview?address-id=${res.data.data._id}`
      );

      // Clear form after submit (optional)
      

    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to save/update address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="address-outer">
      <div className="container">
        <div className="address-inner">
          <div className="summary-heading">
            <h3>{isEditMode ? "Edit Address" : "Add New Address"}</h3>
          </div>
          <div className="card-body">
            <div className="address-form">
              <form onSubmit={handleSubmit}>
                {[
                  { label: "Name", name: "name" },
                  { label: "Mobile Number", name: "mobile", type: "number" },
                  {
                    label: "Alternative Number",
                    name: "altMobile",
                    required: false,
                    type: "number",
                  },
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
                      {field.label}{" "}
                      {field.required === false ? "" : <span className="required">*</span>}
                    </label>
                    <input
                      type={field.type ? field.type : "text"}
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      placeholder={`Enter ${field.label}`}
                      className="form-input common-input-filed"
                      onInput={(e) => {
                        field.type === "number"
                          ? (e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10))
                          : null;
                      }}
                    />
                    {formErrors[field.name] && (
                      <span className="error-text">{formErrors[field.name]}</span>
                    )}
                  </div>
                ))}

                <div className="form-group form-submit">
                  <button type="submit" disabled={loading}>
                    {loading
                      ? isEditMode
                        ? "Updating..."
                        : "Saving..."
                      : isEditMode
                      ? "Update Address"
                      : "Save Address"}
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
