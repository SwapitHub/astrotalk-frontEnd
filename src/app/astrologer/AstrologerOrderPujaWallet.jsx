"use client";
import Loader from "@/app/component/Loader";
import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { FaSearch } from "react-icons/fa";
import debounce from "lodash.debounce";
import Image from "next/image";
import ShowLessShowMore from "../component/ShowLessShowMore";
import CancelOrderPopUp from "../component/CancelOrderPopUp";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import ViewOrderUserDetail from "../component/ViewOrderUserDetail";
import UserOtpLoginData from "../component/UserOtpLoginData";

function AstrologerOrderPujaWallet({ astrologerData }) {
  const [walletAdminData, setWalletAdminData] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editDetailOrder, setEditDetailOrder] = useState(null);
  const [showOrderViewPopUp, setShowOrderViewPopUp] = useState(false);
  const [otpPopUpDisplay, setOtpPopUpDisplay] = useState(false);

  const [cancelOrder, setCancelOrder] = useState({
    orderStatus: false,
    order_id: null,
  });

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
    <>
      {cancelOrder?.orderStatus && (
        <CancelOrderPopUp
          cancelOrder={cancelOrder}
          setCancelOrder={setCancelOrder}
          fetchTransactions={fetchTransactions}
          setLoading={setLoading}
        />
      )}
      {showOrderViewPopUp && (
        <ViewOrderUserDetail
          editDetailOrder={editDetailOrder}
          setShowOrderViewPopUp={setShowOrderViewPopUp}
          setLoading={setLoading}
        />
      )}

      {otpPopUpDisplay && (
        <div className={otpPopUpDisplay == true && `outer-send-otp-main`}>
          <UserOtpLoginData setOtpPopUpDisplay={setOtpPopUpDisplay} />
        </div>
      )}
      <div className="admin-wallet-main">
        <h1>puja Order List</h1>
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
        </div>

        {/* 🌀 Loader or Table */}
        {loading ? (
          <Loader />
        ) : (
          <div className="outer-table">
            <table border="1">
              <thead>
                <tr>
                  {/* <th>User Mobile</th> */}
                  {/* <th>User Status</th> */}
                  <th>Astrologer Name</th>
                  <th>Astrologer Balance</th>
                  <th>Transaction Amount + GST</th>
                  <th>Admin Commission</th>
                  {/* <th>GST</th> */}
                  <th>Product Name</th>
                  <th>Date and Time</th>
                  {/* <th>Product</th> */}
                  <th>Product Order Status</th>
                </tr>
              </thead>
              <tbody>
                {walletAdminData?.length > 0 ? (
                  walletAdminData.map((item) => (
                    <tr key={item._id}>
                      {/* <td>{item.userMobile}</td> */}
                      {/* <td>{item.status}</td> */}
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
                      {/* <td>₹ {Math.round(item.gstAmount) || 0}</td> */}
                      <td>{item.productName}</td>
                      <td>{new Date(item.createdAt).toLocaleString()}</td>
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
                          alt={item?.name}
                        />
                      </td> */}
                      <td>
                        {!item?.product_cancel_order ? (
                          <>
                            <div className="td-btns-outer">
                              <button
                                onClick={() => {
                                  setCancelOrder({
                                    orderStatus: true,
                                    order_id: item?.order_id,
                                  });
                                }}
                              >
                                Cancel Order
                              </button>
                              <button
                                className="delete-btn"
                                onClick={() => {
                                  setEditDetailOrder(item);
                                  setShowOrderViewPopUp(true);
                                }}
                              >
                                <MdOutlineRemoveRedEye />
                              </button>
                              <select
                                value={
                                  !item?.product_order_status
                                    ? "processing"
                                    : item?.product_order_complete
                                    ? "completed"
                                    : "dispatched"
                                }
                                onChange={(e) => {
                                  const selected = e.target.value;

                                  if (selected === "processing") {
                                    updateOrderStatus(
                                      item?.order_id,
                                      false,
                                      false
                                    );
                                  } else if (selected === "dispatched") {
                                    updateOrderStatus(
                                      item?.order_id,
                                      true,
                                      false
                                    );
                                  } else if (selected === "completed") {
                                    setOtpPopUpDisplay(true);
                                    // updateOrderStatus(item?.order_id, true, true);
                                  }
                                }}
                                disabled={loading}
                              >
                                <option value="processing">Processing</option>
                                <option value="dispatched">Dispatched</option>
                                <option value="completed">Completed</option>
                              </select>
                            </div>
                          </>
                        ) : (
                          <>
                            <h4>Order Canceled</h4>
                            <p>
                              <span>Reason Canceled :</span>{" "}
                              <ShowLessShowMore
                                description={item?.product_cancel_order_reason}
                                totalWord={10}
                              />
                            </p>
                          </>
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
    </>
  );
}

export default AstrologerOrderPujaWallet;
