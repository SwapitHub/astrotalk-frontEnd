"use client";
import Loader from "@/app/component/Loader";
import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { FaSearch } from "react-icons/fa";
import debounce from "lodash.debounce";
import Image from "next/image";

function AdminPujaProductWallet() {
  const [walletAdminData, setWalletAdminData] = useState([]);
  const [totalAdminCommission, setTotalAdminCommission] = useState();
  const [searchName, setSearchName] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

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
          },
        }
      );

      const { orders, pagination } = res.data;
      setTotalAdminCommission(res.data?.totalAdminCommission);
      setWalletAdminData(orders);
      setTotalPages(pagination.totalPages || 0);
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

  const updateOrderStatus = async (orderId, status, complete) => {
    setLoading(true);
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/update-any-field-payment-shop/${orderId}`,
        {
          product_order_status: status,
          product_order_complete: complete,
        }
      );

      if (res?.status === 200) {
        fetchTransactions(); // Refresh data
      }
    } catch (err) {
      console.log(err, "update order product api error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-wallet-main">
      <h1>Admin Puja Commission Wallet List</h1>
      {/* 🔍 Search Bar */}
      <div className="search-box-top-btn">
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
        {/* <div className="search-help-text">
          <p>Search product based on product id</p>
        </div> */}
        <div className="search-help-text">
          <p>
            Admin Puja total commission Amount : ₹ {totalAdminCommission || 0}
          </p>
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
                <th>Puja Order id</th>
                {/* <th>Order place by name</th> */}
                {/* <th>Astrologer Name</th> */}
                <th>Puja Name</th>
                <th>Total Amount Puja</th>
                <th>Admin Commission</th>
                <th>Puja GST</th>
                {/* <th>Puja img</th> */}
                <th>Date and Time</th>
              </tr>
            </thead>
            <tbody>
              {walletAdminData?.length > 0 ? (
                walletAdminData.map((item) => (
                  <tr key={item._id}>
                    <td>{item.order_id}</td>
                    {/* <td>{item?.userName}</td> */}
                    {/* <td>{item?.astrologerName}</td> */}
                    <td>{item?.productName}</td>
                    <td>₹ {item?.totalAmount}</td>
                    <td>₹ {item?.adminCommission}</td>
                    <td>₹ {item?.gstAmount}</td>
                    {/* <td>
                      <Image
                        width={100}
                        height={100}
                        src={
                          item?.productImg
                            ? process.env.NEXT_PUBLIC_WEBSITE_URL +
                              item?.productImg
                            : "/user-icon-image.png"
                        }
                        alt="certificate"
                      />
                    </td> */}
                    <td>{new Date(item.createdAt).toLocaleString()}</td>
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
      {totalPages > 0 ? (
        <div className="admin-wallet-inner">
          <button onClick={handlePrevious} disabled={page <= 0 || loading}>
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button onClick={handleNext} disabled={page >= totalPages || loading}>
            Next
          </button>
        </div>
      ) : (
        <p className="data-not-found">Data Not Found</p>
      )}
    </div>
  );
}

export default AdminPujaProductWallet;
