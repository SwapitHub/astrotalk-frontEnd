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

  const handleSubmitAmount = async () => {
    const formData = {
      amount: document.getElementById("amount").value,
      extraAmount: document.getElementById("extra-amount").value,
    };

    if (!formData.amount || !formData.extraAmount) {
      console.log("Please fill in all fields");
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
        <h2>Add a New Language</h2>
        <div className="admin-form-box">
          <div className="form-field Amount">
            <label>Enter Amount</label>
            <input
              type="text"
              placeholder="enter amount"
              id="amount"
              className="common-input-filed"
            />
          </div>

          <div className="form-field">
            <label>Enter extra Amount</label>
            <input
              type="text"
              placeholder="enter extra amount"
              id="extra-amount"
              className="common-input-filed"
            />
          </div>

          <div className="form-field">
            <label>Add popular</label>
            <input
              type="checkbox"
              onChange={() => setMostPopularData(!mostPopularData)}
              placeholder="enter extra amount"
              id="mostPopular"
            />
          </div>
          <button onClick={handleSubmitAmount}>Submit</button>
        </div>
      </div>

      <div className="language-list">
        <h2>Available Languages</h2>
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
                      <span>₹ {item?.extraAmount}</span>
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
