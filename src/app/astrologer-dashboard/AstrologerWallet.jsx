"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import Loader from "../component/Loader";

function AstrologerWallet() {
  const [walletAdminData, setWalletAdminData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [totalAvailableBalance, setTotalAvailableBalance] = useState();
  const [loading, setLoading] = useState(false);
  const [astrologerPhone, setAstrologerPhone] = useState();

  useEffect(() => {
    const astrologerPhones = sessionStorage.getItem("astrologer-phone");
    setAstrologerPhone(astrologerPhones);
  }, []);

  const fetchTransactions = async (pageNumber) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/chat/transaction-data-astroLoger/${astrologerPhone}?page=${pageNumber}&limit=6`
      );
      console.log(data);
      setWalletAdminData(data.transactions || []);
      setPage(data.currentPage);
      setTotalPages(data.totalPages);
      setHasNextPage(data.hasNextPage);
      setHasPrevPage(data.hasPrevPage);
      setTotalAvailableBalance(data.totalAvailableBalance);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (astrologerPhone) {
      fetchTransactions(page);
    }
  }, [page, astrologerPhone]);

  return (
    <div className="admin-wallet-main">
      <p>
        Available balance:{" "}
        <span>₹ {Math.round(totalAvailableBalance) || 0}</span>
      </p>
      {loading ? (
        <Loader />
      ) : (
        <div className="outer-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>User Name</th>
                <th>Available Balance</th>
                <th>Transaction Amount</th>
                <th>Description</th>
                <th>Date and Time</th>
              </tr>
            </thead>
            <tbody>
              {walletAdminData.length > 0 ? (
                walletAdminData.map((item) => (
                  <tr key={item._id}>
                    <td>{item._id}</td>
                    <td>{item.userName || "N/A"}</td>
                    <td>{Math.round(item.availableBalance)}</td>
                    <td>{item.transactionAmount}</td>
                    <td>{item.description || "No Description"}</td>
                    <td>{new Date(item.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No transactions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <div className="admin-wallet-inner">
        <button
          onClick={() => setPage(page - 1)}
          disabled={!hasPrevPage || loading}
          className={!hasPrevPage && "disable"}
        >
          Previous
        </button>
        <span>
          {" "}
          Page {page} of {totalPages}{" "}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={!hasNextPage || loading}
          className={!hasNextPage && "disable"}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default AstrologerWallet;
