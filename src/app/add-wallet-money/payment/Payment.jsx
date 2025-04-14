"use client";
import RazorpayPayment from "@/app/component/RazorpayPayment";
import axios from "axios";
import React, { useEffect, useState } from "react";

const Payment = ({ pmtId }) => {
  const [priceDetail, setPriceDetail] = useState();

  useEffect(() => {
    if(pmtId){
      axios
      .get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/denomination-admin-detail/${pmtId}`
      )
      .then((res) => {
        setPriceDetail(res.data);
      })
      .catch((err) => {
        console.log("price detail api not work", err);
      });
    }
    
  }, [pmtId]);

  const priceNumber = Math.round(parseInt(priceDetail?.data?.amount) || 0);
  const gstRate = 18 / 100;
  const totalGstPrice = Math.round(priceNumber * gstRate);
  const totalFinalPrice = Math.round(priceNumber + totalGstPrice);
  const totalAmount = Math.round(priceNumber + Math.round(priceDetail?.data?.extraAmount));


  return (
    <div className="payment-page">
      <div className="container">
        <h1>Payment Details</h1>
        <table>
          <tbody>
            <tr>
              <td>Recharge Amount</td>
              <td>₹ {priceNumber}.00</td>
            </tr>
            <tr>
              <td>Extra Amount</td>
              <td>₹ {priceDetail?.data?.extraAmount}.00</td>
            </tr>
            <tr>
              <td>GST@18%</td>
              <td>₹ {totalGstPrice}.00</td>
            </tr>
            <tr>
              <td>Total Amount</td>
              <td>₹ {totalFinalPrice}.00</td>
            </tr>
          </tbody>
        </table>

        <div className="payment-coupon">
          <h2>Apply another coupon</h2>
          <RazorpayPayment totalFinalPrice={totalFinalPrice} extraAmount={Math.round(priceDetail?.data?.extraAmount)} totalAmount={totalAmount}/>
        </div>
      </div>
    </div>
  );
};

export default Payment;
