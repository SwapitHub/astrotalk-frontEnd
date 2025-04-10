"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";

function AdminWallet({ updateButton }) {
  const [walletAdminData, setWalletAdminData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [totalAvailableBalance, setTotalAvailableBalance] = useState(0);

  const fetchTransactions = async (pageNumber) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/chat/WalletTransactionData?type=${updateButton}&page=${pageNumber}&limit=6`
      );

      setWalletAdminData(res.data.transactions);
      setPage(res.data.page);
      setTotalPages(Math.ceil(res.data.totalTransactions / 6)); 
      setHasNextPage(res.data.hasNextPage);
      setHasPrevPage(res.data.hasPrevPage);
      setTotalAvailableBalance(res.data.availableBalance);
    } catch (err) {
      console.log(err, "admin wallet api error");
    }
  };

  useEffect(() => {
    if (updateButton) {
      fetchTransactions(page);
    }
  }, [updateButton, page]); 

  return (
    <div>
      {updateButton === "admin" && (
        <p>
          <strong>Available balance: </strong>
          <span>₹ {totalAvailableBalance}</span>
        </p>
      )}

      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Available Balance</th>
            <th>Transaction Amount</th>
            <th>Description</th>
            <th>Date and Time</th>
          </tr>
        </thead>
        <tbody>
          {walletAdminData?.map((item) => (
            <tr key={item._id}>
              <td>{item._id}</td>
              <td>{item.name}</td>
              <td>₹ {item.availableBalance}</td>
              <td>₹ {item.transactionAmount}</td>
              <td>{item.description}</td>
              <td>{new Date(item.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "10px" }}>
        <button onClick={() => setPage(page - 1)} disabled={!hasPrevPage}>
          Previous
        </button>
        <span>
          {" "}
          Page {page} of {totalPages}{" "}
        </span>
        <button onClick={() => setPage(page + 1)} disabled={!hasNextPage}>
          Next
        </button>
      </div>
    </div>
  );
}

export default AdminWallet;
