"use client";
import useDebounce from "@/app/hook/useDebounce";
import axios from "axios";
import React, { useEffect, useState } from "react";

const WalletView = ({
  mobileNumber = "8578554445",
  setAddActiveClass,
  setLoading,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 800);

  const [astroDetailData, setAstroDetail] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 4,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [chatStatusRecord, setChatStatusRecord] = useState(false);

  // ✅ Fetch user details only once
  const fetchUserDetail = async (mobileNumber) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/get-all-users-with-wallet-detail/${mobileNumber}?page=1&limit=${pagination.limit}`
      );
      setAstroDetail(res.data?.user || null);
    } catch (err) {
      console.error("Astrologer detail not found:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch only transactions (with pagination + search)
  const fetchTransactions = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/get-all-users-with-wallet-detail/${mobileNumber}?page=${pagination.page}&limit=${pagination.limit}&search=${debouncedSearch}`
      );

      setTransactions(res.data?.transactions || []);
      setPagination((prev) => ({
        ...prev,
        page: res.data?.pagination?.page || 1,
        totalPages: res.data?.pagination?.totalPages || 1,
        hasNextPage: res.data?.pagination?.hasNextPage || false,
        hasPrevPage: res.data?.pagination?.hasPrevPage || false,
      }));
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  // Load user details once
  useEffect(() => {
    if (mobileNumber) {
      fetchUserDetail(mobileNumber);
    }
  }, [mobileNumber]);

  // Load transactions on page/search change
  useEffect(() => {
    if (mobileNumber && chatStatusRecord) {
      fetchTransactions();
    }
  }, [pagination.page, debouncedSearch, chatStatusRecord]);

  return (
    <div className="astro-detail-main-view">
      <span
        className="close"
        onClick={() => {
          setAddActiveClass(false);
        }}
      >
        X
      </span>

      <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
        User Details
      </h2>

      {/* User Table */}
      <div className="outer-table">
        <table border="1" cellPadding="8" style={{ marginBottom: "20px" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Mobile Number</th>
              <th>Available Balance</th>
              <th>DateOfBirth</th>
              <th>Gender</th>
              <th>Language</th>
              <th>Place Of Born</th>
              <th>Date and Time</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{astroDetailData?.name}</td>
              <td>{astroDetailData?.phone}</td>
              <td>₹ {astroDetailData?.totalAmount}</td>
              <td>{astroDetailData?.dateOfBirth}</td>
              <td>{astroDetailData?.gender}</td>
              <td>{astroDetailData?.language}</td>
              <td>{astroDetailData?.placeOfBorn}</td>
              <td>
                {astroDetailData?.createdAt &&
                  new Date(astroDetailData?.createdAt).toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Toggle Transactions */}
      <button
        onClick={() => {
          setChatStatusRecord(!chatStatusRecord);
        }}
      >
        {chatStatusRecord
          ? "Hide Wallet Transactions"
          : "Show Wallet Transactions"}
      </button>

      {/* Transactions Table */}
      {chatStatusRecord && (
        <div className="chat-record">
          <h2 style={{ textAlign: "center", margin: "20px 0" }}>
            User Wallet Transactions
          </h2>

          {/* Search Box */}
          <input
            type="search"
            placeholder="Search transaction id / type / status..."
            aria-label="Search wallet transactions"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPagination((prev) => ({ ...prev, page: 1 })); // reset to page 1 on search
            }}
          />

          <div className="outer-table">
            <table border="1" cellPadding="8">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Name</th>
                  <th>Available Balance</th> <th>Transaction Amount</th>
                  <th>Description</th>
                  <th>Date</th>
                </tr>
              </thead>
              {transactions?.length > 0 ? (
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx._id}>
                      <td>trnastion id</td>
                      <td>{tx.name}</td> <td>₹ {tx.availableBalance}</td>{" "}
                      <td>₹ {tx.transactionAmount}</td>{" "}
                      <td>{tx.description}</td>{" "}
                      <td>{new Date(tx.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              ) : (
                <p colSpan="6" style={{ textAlign: "center" }}>
                  No Transactions Found
                </p>
              )}
            </table>
          </div>

          {/* Pagination Controls */}
          <div style={{ marginTop: "15px", textAlign: "center" }}>
            <button
              disabled={!pagination.hasPrevPage}
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
              }
            >
              Prev
            </button>
            <span style={{ margin: "0 10px" }}>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              disabled={!pagination.hasNextPage}
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
              }
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletView;
