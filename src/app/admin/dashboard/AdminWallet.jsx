"use client";
import Loader from "@/app/component/Loader";
import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { FaSearch } from "react-icons/fa";
import debounce from "lodash.debounce";

function AdminWallet({ updateButton }) {
  const [walletAdminData, setWalletAdminData] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [pages, setPages] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("admin_wallet_pages");
      return saved ? JSON.parse(saved) : { admin: 1, user: 1, astrologer: 1 };
    }
    return { admin: 1, user: 1, astrologer: 1 };
  });

  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [totalAvailableBalance, setTotalAvailableBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  // Debounce search input to avoid frequent API calls
  const debounceSearch = useCallback(
    debounce((query) => {
      setDebouncedSearch(query);
      setPages((prev) => ({ ...prev, [updateButton]: 1 })); // reset to page 1
    }, 500),
    [updateButton]
  );

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchName(query);
    debounceSearch(query);
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const currentPage = pages[updateButton] || 1;

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/chat/WalletTransactionData`,
        {
          params: {
            type: updateButton,
            page: currentPage,
            limit: 5,
            search: debouncedSearch,
          },
        }
      );

      setWalletAdminData(res.data.transactions);
      setTotalPages(Math.ceil(res.data.totalTransactions / 5));
      setHasNextPage(res.data.hasNextPage);
      setHasPrevPage(res.data.hasPrevPage);
      setTotalAvailableBalance(res.data.availableBalance);
    } catch (err) {
      console.log(err, "admin wallet api error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (updateButton) {
      fetchTransactions();
    }
  }, [updateButton, debouncedSearch, pages[updateButton]]);

  const handleNext = () => {
    setPages((prev) => ({
      ...prev,
      [updateButton]: prev[updateButton] + 1,
    }));
  };

  const handlePrevious = () => {
    setPages((prev) => ({
      ...prev,
      [updateButton]: prev[updateButton] - 1,
    }));
  };

  return (
    <div className="admin-wallet-main">
      {updateButton === "admin" && (
        <p>
          <strong>Available balance: </strong>
          <span>₹ {Math.round(totalAvailableBalance)}</span>
        </p>
      )}

      <div className="filter-button search-box-top-btn">
        <div className="search-box-filed">
          <input
            type="search"
            id="astrologer-search"
            name="astrologer-search"
            placeholder="Search name or mobile..."
            value={searchName}
            onChange={handleSearchChange}
            aria-label="Search wallet transactions"
          />
        </div>
        <div className="search-button-filed">
          <button type="button">
            <FaSearch />
          </button>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="outer-table">
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
                  <td>₹ {Math.round(item.availableBalance)}</td>
                  <td>₹ {item.transactionAmount}</td>
                  <td>{item.description}</td>
                  <td>{new Date(item.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="admin-wallet-inner">
        <button
          onClick={handlePrevious}
          disabled={!hasPrevPage || loading}
          className={!hasPrevPage ? "disable" : ""}
        >
          Previous
        </button>
        <span>
          Page {pages[updateButton]} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={!hasNextPage || loading}
          className={!hasNextPage ? "disable" : ""}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default AdminWallet;
