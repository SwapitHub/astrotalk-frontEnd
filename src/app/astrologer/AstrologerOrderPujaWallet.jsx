"use client";
import Loader from "@/app/component/Loader";
import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { FaSearch } from "react-icons/fa";
import debounce from "lodash.debounce";

function AstrologerOrderPujaWallet({ astrologerData }) {
  const [walletAdminData, setWalletAdminData] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  console.log(astrologerData);

  // Debounce search input
  const debounceSearchHandler = useCallback(
    debounce((query) => {
      setDebouncedSearch(query);
      setPage(1); // Reset to page 1 on new search
    }, 500),
    []
  );

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchName(query);
    debounceSearchHandler(query);
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/shop-order-list`,
        {
          params: {
            page,
            limit: 2, // Adjust as needed
            search: debouncedSearch,
            productType: "astroPujaProduct",
            astrologerName: astrologerData?.name || "null",
          },
        }
      );

      const { orders, pagination } = res.data;

      setWalletAdminData(orders);
      setTotalPages(pagination.totalPages || 1);
    } catch (err) {
      console.log("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [debouncedSearch, page]);

  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  return (
    <div className="admin-wallet-main">
      {/* 🔍 Search Bar */}
      <div className="filter-button search-box-top-btn">
        <div className="search-box-filed">
          <input
            type="search"
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

      {/* 🌀 Loader or Table */}
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
                <th>Astrologer Balance</th>
                <th>Transaction Amount + GST</th>
                <th>Admin Commission</th>
                <th>GST</th>
                <th>Product Name</th>
                <th>Date and Time</th>
                <th>Product</th>
                <th>Product Order Status</th>
              </tr>
            </thead>
            <tbody>
              {walletAdminData?.length > 0 ? (
                walletAdminData.map((item) => (
                  <tr key={item._id}>
                    <td>{item.userMobile}</td>
                    <td>{item.status}</td>
                    <td>{item.astrologerName}</td>
                    <td>
                      ₹{" "}
                      {Math.round(item.totalAmount) -
                        Math.round(item.adminCommission) || 0}
                    </td>
                    <td>
                      ₹{" "}
                      {Math.round(item.totalAmount) +
                        Math.round(item.gstAmount) || 0}
                    </td>
                    <td>₹ {Math.round(item.adminCommission) || 0}</td>
                    <td>₹ {Math.round(item.gstAmount) || 0}</td>
                    <td>{item.productName}</td>
                    <td>{new Date(item.createdAt).toLocaleString()}</td>
                    <td>
                      <img src={item?.productImg} alt={item?.name} />
                    </td>
                    <td>
                      {!item?.product_order_status ? (
                        <span>Processing</span>
                      ) : (
                        <span>
                          {item?.product_order_complete
                            ? "completed"
                            : "Dispatched"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No transactions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ⏮️ Pagination Controls */}
      <div className="admin-wallet-inner">
        <button onClick={handlePrevious} disabled={page <= 1 || loading}>
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button onClick={handleNext} disabled={page >= totalPages || loading}>
          Next
        </button>
      </div>
    </div>
  );
}

export default AstrologerOrderPujaWallet;
