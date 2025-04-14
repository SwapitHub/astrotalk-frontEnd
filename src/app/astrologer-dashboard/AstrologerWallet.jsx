"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";

function AstrologerWallet() {
  const [walletAdminData, setWalletAdminData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [totalAvailableBalance, setTotalAvailableBalance] = useState();
  const astrologerPhone = typeof window !== "undefined" ? secureLocalStorage.getItem("astrologer-phone") : null;

  const fetchTransactions = async (pageNumber) => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/chat/transaction-data-astroLoger/${astrologerPhone}?page=${pageNumber}&limit=6`
      );
      
      setWalletAdminData(data.transactions || []);
      setPage(data.currentPage);
      setTotalPages(data.totalPages);
      setHasNextPage(data.hasNextPage);
      setHasPrevPage(data.hasPrevPage);
      setTotalAvailableBalance(data.totalAvailableBalance)
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    if (astrologerPhone) {
      fetchTransactions(page);
    }
  }, [page, astrologerPhone]);

  return (
    <div>
      <p>
        Available balance: <span>₹ {totalAvailableBalance || 0}</span>
      </p>

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
                <td>{item.availableBalance}</td>
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

      <div>
        <button onClick={() => setPage(page - 1)} disabled={!hasPrevPage}>
          Previous
        </button>
        <span> Page {page} of {totalPages} </span>
        <button onClick={() => setPage(page + 1)} disabled={!hasNextPage}>
          Next
        </button>
      </div>
    </div>
  );
}

export default AstrologerWallet;
