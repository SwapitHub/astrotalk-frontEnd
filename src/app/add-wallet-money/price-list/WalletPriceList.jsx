"use client";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";

const WalletPriceList = () => {
  const [denominationList, setDenominationList] = useState([]);
  const [userData, setUserData] = useState();
  const userMobile = Math.round(secureLocalStorage.getItem("userMobile"));

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/denomination-admin`)
      .then((res) => {
        setDenominationList(res.data);
      })
      .catch((err) => {
        console.log("denomination error", err);
      });
  }, []);

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/user-login-detail/${userMobile}`
      )
      .then((res) => {
        setUserData(res.data);
      })
      .catch((err) => {
        console.log(err, "user login api error");
      });
  }, []);
  return (
    <section className="add-money-wallet-bg">
      <div className="container">
        <div className="inner-add-money-wallet">
          <h2 className="common-h1-heading">Add Money to Wallet</h2>
          <div className="Available-balance-sec">
            <p>Available balance:</p>
            <div className="Walle-amount">
              <span>₹ {userData?.totalAmount}</span>
            </div>
          </div>
        </div>
        <div className="popular-recharge-sec">
          {denominationList.map((item) => {
            return (
              <>
                <div className="inner-popular-recharge-sec" key={item._id}>
                  <Link href={`/add-wallet-money/payment?pmt=${item._id}`} title="Money ">
                    <div className="popular-amount">
                      <span>₹ {item.amount}</span>
                    </div>
                    <div className="extra-discount">
                      <span>₹ {item.extraAmount} Extra</span>
                    </div>
                    {item.mostPopular && (
                      <div className="most-popular-tag">
                        <span>Most Popular</span>
                      </div>
                    )}
                  </Link>
                </div>
                ;
              </>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WalletPriceList;
