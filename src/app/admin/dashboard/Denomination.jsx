"use client";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

const Denomination = () => {
const [mostPopularData,setMostPopularData] = useState(false)


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
        mostPopular: mostPopularData
      }
    );
    if (response.data.message == "success") {
      document.getElementById("amount").value = "";
      document.getElementById("extra-amount").value = "";
      console.log("Added amount successfully.");
      toast.success("Added Amount successFully", {
        position: "top-right",
      });
    }
  };
  return (
    <div className="Denomination">
      <h1>Denomination</h1>
      <div className="Denomination-form">
        <div className="amount">
          <label>Enter Amount</label>
          <input type="text" placeholder="enter amount" id="amount" />
        </div>

        <div className="amount">
          <label>Enter extra Amount</label>
          <input
            type="text"
            placeholder="enter extra amount"
            id="extra-amount"
          />
        </div>

        <div className="amount">
          <label>Add popular</label>
          <input
            type="checkbox"
            onChange={()=>setMostPopularData(!mostPopularData)}
            placeholder="enter extra amount"
            id="mostPopular"
          />
        </div>
        <button onClick={handleSubmitAmount}>Submit</button>
      </div>
    </div>
  );
};

export default Denomination;
