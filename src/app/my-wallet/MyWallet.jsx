"use client";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import Loader from "../component/Loader";
import Cookies from "js-cookie";

const MyWallet = () => {

  const [userData, setUserData] = useState();
  const [WalletTransactionData, setWalletTransactionData] = useState([]);
const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [userPhone, setUserPhone] = useState(false);
  const [userIds, setUserIds] = useState(false);
 
useEffect(()=>{
  const userPhones = Math.round(Cookies.get("userMobile"));
  const userId = Cookies.get("userIds")
  setUserPhone(userPhones)
  setUserIds(userId)
},[])


  const fetchTransactions = async (pageNumber) => {
    let limit=4
    try {
      setLoading(true)
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/chat/WalletTransactionData?type=user&user_id=${userIds}&page=${pageNumber}&limit=${limit}`
      );

      setWalletTransactionData(res.data.transactions);
      setPage(res.data.page);
      setTotalPages(Math.ceil(res.data.totalTransactions / limit)); 
      setHasNextPage(res.data.hasNextPage);
      setHasPrevPage(res.data.hasPrevPage);
    } catch (err) {
      console.log(err, "admin wallet api error");
    }
    finally{
      setLoading(false)
    }
  };

  useEffect(() => {
    if (userIds) {
      fetchTransactions(page);
    }
  }, [page,userIds]); 

  useEffect(() => {
    const fetchUserLoginDetail = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/user-login-detail/${userPhone}`
        );
        setUserData(response.data.data);
      } catch (error) {
        console.log("Error login detail api", error);
      }
    };
  if(userPhone){

      fetchUserLoginDetail();
  }
  }, [userPhone]);
  return (
    <div
      className="wallet-ctm-tab wallet-ctm-tab-active"
      data-id="wallet-ctm-tab1"
    >
      <div className="my-wallet-sec-heading-content">
        <h1 className="common-h1-heading">Transactions</h1>
      </div>
      <div className="inner-my-wallet-sec ctm-flex-row ctm-justify-content-between">
        <div className="my-wallet-sec-left-content ctm-align-items-center ctm-flex-row">
          <div className="my-walleavailable-balance-text">
            <p>
              Available balance: <span>₹ {userData?.totalAmount}</span>
            </p>
          </div>
          <div className="recharge-btm">
            <Link
              href="/add-wallet-money/price-list"
              title="Recharge"
              className="my-wallet-recharge-button"
            >
              Recharge
            </Link>
          </div>
        </div>
        <div className="my-wallet-sec-right-content">
          <div className="inner-talk-to-astrologer-right-content">
            <div className="my-wallet-recharge-btm delate-all-btn">
              <a
                href="#"
                title="Delete All"
                className="my-wallet-recharge-button"
              >
                Delete All
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="my-wallet-table-sec">
        {loading ?  <Loader/> : 
        <div className="outer-table">
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Invoice</th>
              <th>Transaction Amount</th>
              <th>Date Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {WalletTransactionData?.map((item) => {
              return (
                <>
                  <tr>
                    <td>{item.description}</td>
                    <td>
                      <a
                        href="#"
                        title="Invoice"
                        className="invoice-button-ctm"
                      >
                        {" "}
                        Invoice{" "}
                      </a>
                    </td>
                    <td>
                      <span className="ctm-color-red">
                        ₹ {item.transactionAmount}
                      </span>
                    </td>
                    <td>{new Date(item.createdAt).toLocaleString()}</td>
                    <td className="delete-button-icon">
                      <a href="#" title="Remove">
                        <i className="fa-solid fa-trash"></i>
                      </a>
                    </td>
                  </tr>
                </>
              );
            })}
          </tbody>
        </table>
        </div>
}
        <div className="pagination-outer" style={{ marginTop: "10px" }}>
        <button onClick={() => setPage(page - 1)} disabled={!hasPrevPage || loading}
          className={!hasPrevPage && "disable"}
          
          >
          Previous
        </button>
        <span>
          {" "}
          Page {page} of {totalPages}{" "}
        </span>
        <button onClick={() => setPage(page + 1)} disabled={!hasNextPage || loading}
          className={!hasNextPage && "disable"}
          
          >
          Next
        </button>
      </div>
      </div>
    </div>
  );
};

export default MyWallet;
