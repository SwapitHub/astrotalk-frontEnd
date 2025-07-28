"use client";
import Loader from "@/app/component/Loader";
import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { FaSearch } from "react-icons/fa";
import debounce from "lodash.debounce";
import secureLocalStorage from "react-secure-storage";

function AdminShopWallet({ updateButton }) {
  const [walletAdminData, setWalletAdminData] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [pages, setPages] = useState({
    admin: 1,
    user: 1,
    astrologer: 1,
  });
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log(walletAdminData);

  // Debounce search input
  const debounceSearchHandler = useCallback(
    debounce((query) => {
      setDebouncedSearch(query);
      setPages((prev) => ({ ...prev, [updateButton]: 1 })); // Reset to page 1 on search change
    }, 500),
    [updateButton]
  );

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchName(query);
    debounceSearchHandler(query);
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const currentPage = pages[updateButton] || 1;

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/shop-order-list`,
        {
          params: {
            type: updateButton,
            page: currentPage,
            limit: 4, // Adjust the limit here based on your requirement
            search: debouncedSearch,
            productType: "astroPujaProduct",
          },
        }
      );
      console.log(res);

      setWalletAdminData(res.data.orders);
      setTotalPages(Math.ceil(res.data.pagination.totalPages));
      setHasNextPage(res.data.pagination.nextPage);
      setHasPrevPage(res.data.pagination.currentPage);
    } catch (err) {
      console.log("API Error:", err);
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
    if (!updateButton || !pages[updateButton]) return;

    setPages((prev) => ({
      ...prev,
      [updateButton]: prev[updateButton] + 1,
    }));
  };

  const handlePrevious = () => {
    if (!updateButton || !pages[updateButton]) return;

    setPages((prev) => ({
      ...prev,
      [updateButton]: prev[updateButton] - 1,
    }));
  };

  return (
    <div className="admin-wallet-main">
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
                <th>User Mobile</th>
                <th>User Status</th>
                <th>Astrologer Name</th>
                <th>Transaction Amount</th>
                <th>Product Name</th>
                <th>Date and Time</th>
                <th>Product</th>
              </tr>
            </thead>
            <tbody>
              {walletAdminData?.map((item) => (
                <tr key={item._id}>
                  <td>{item.userMobile}</td>
                  <td>{item.status}</td>
                  <td>{item.astrologerName}</td>
                  <td>₹ {Math.round(item.amount)}</td>
                  <td>{item.productName}</td>
                  <td>{new Date(item.createdAt).toLocaleString()}</td>
                  <td>
                    <img src={item?.productImg} alt={item?.name} />
                  </td>
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

export default AdminShopWallet;
