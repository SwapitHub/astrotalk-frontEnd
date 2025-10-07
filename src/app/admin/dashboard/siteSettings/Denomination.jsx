"use client";
import Loader from "@/app/component/Loader";
import useCustomGetApi from "@/app/hook/CustomHookGetApi";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

const Denomination = () => {
  const [mostPopularData, setMostPopularData] = useState(false);
  const {
    data: denominationData,
    loading,
    fetchGetData,
  } = useCustomGetApi("denomination-admin");
  const [message, setMessage] = useState("");

  const handleSubmitAmount = async () => {
    const formData = {
      amount: document.getElementById("amount").value,
      extraAmount: document.getElementById("extra-amount").value,
    };
    if (!formData.amount || !formData.extraAmount) {
      return setMessage("All Fields Are Required !");
    }
    
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_WEBSITE_URL}/denomination-admin`,
      {
        amount: formData.amount,
        extraAmount: formData.extraAmount,
        mostPopular: mostPopularData,
      }
    );
    if (response.data.message == "success") {
      document.getElementById("amount").value = "";
      document.getElementById("extra-amount").value = "";
      console.log("Added amount successfully.");
      toast.success("Added Amount successFully", {
        position: "top-right",
      });
      fetchGetData();
      setMessage("")
    }
  };

  const deleteDenomination = async (id) => {
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/delete-denomination-admin/${id}`
      );

      if (res.data.message === "success") {
        toast.success("Denomination removed successfully!", {
          position: "top-right",
        });
        fetchGetData();
      }
    } catch (err) {
      console.error("Delete language error:", err);
      toast.error("Failed to delete language.", { position: "top-right" });
    }
  };
  return (
    <div className="AddLanguage Denomination">
      <div className="language-add-data">
        <h2>Add a New Denomination</h2>
        <div className="admin-form-box">
          <div className="form-field Amount">
            <div className="label-content">
              <label>Enter Amount</label>
            </div>
            <input
              type="number"
              placeholder="enter amount"
              id="amount"
              className="common-input-filed"
              onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "e") {
                    e.preventDefault();
                  }
                }}
            />
          </div>

          <div className="form-field">
            <div className="label-content">
              <label>Enter extra Amount</label>
            </div>
            <input
              type="number"
              placeholder="enter extra amount"
              id="extra-amount"
              className="common-input-filed"
              onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "e") {
                    e.preventDefault();
                  }
                }}
            />
          </div>

          <div className="form-field field-checkbox man-input-filed-sec">
            <label>
              <input
                type="checkbox"
                onChange={() => setMostPopularData(!mostPopularData)}
                placeholder="enter extra amount"
                id="mostPopular"
              />
              <span>Add popular</span>
            </label>
          </div>
          <button onClick={handleSubmitAmount}>Submit</button>
          <p className="error-msg">{message}</p>
        </div>
      </div>

      <div className="language-list">
        <h2>Available Denomination</h2>
        {loading ? (
          <Loader />
        ) : (
          <ul>
            {denominationData.map((item) => (
              <li key={item._id}>
                <div class="popular-recharge-sec">
                  <div class="inner-popular-recharge-sec">
                    <div class="popular-amount">
                      <span>₹ {item?.amount}</span>
                    </div>
                    <div class="extra-discount">
                      <span>₹ {item?.extraAmount} Extra</span>
                    </div>
                    {item?.mostPopular && (
                      <div class="most-popular-tag">
                        <span>Most Popular</span>
                      </div>
                    )}
                  </div>
                </div>
                <button onClick={() => deleteDenomination(item._id)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Denomination;
