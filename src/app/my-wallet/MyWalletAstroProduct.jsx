"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Loader from "../component/Loader";
import Image from "next/image";
import ShowLessShowMore from "../component/ShowLessShowMore";
import CancelOrderPopUp from "../component/CancelOrderPopUp";
import EditOrderUserDetail from "../component/EditOrderUserDetail";
import ViewOrderUserDetail from "../component/ViewOrderUserDetail";
import { FaEdit } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";

const MyWalletAstroProduct = () => {
  const [walletTransactions, setWalletTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cancelOrder, setCancelOrder] = useState({
    orderStatus: false,
    order_id: null,
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);

  const [userMobile, setUserMobile] = useState(null);
  const [showOrderPopUp, setShowOrderPopUp] = useState(false);
  const [editDetailOrder, setEditDetailOrder] = useState(null);
  const [showOrderViewPopUp, setShowOrderViewPopUp] = useState(false);

  const limit = 3;

  useEffect(() => {
    const mobile = Cookies.get("userMobile");
    setUserMobile(mobile);
  }, []);

  useEffect(() => {
    if (userMobile) {
      fetchTransactions(page);
    }
  }, [page, userMobile]);

  const fetchTransactions = async (pageNumber) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/shop-order-list`,
        {
          params: {
            type: "shop-ProductWallet",
            page: pageNumber,
            limit: limit,
            userMobile: userMobile,
            productType: "astroProduct",
          },
        }
      );

      const { orders = [], pagination = {} } = res.data;

      setWalletTransactions(orders);
      setPage(pagination.currentPage || 1);
      setTotalPages(pagination.totalPages || 1);
      setHasNextPage(!!pagination.nextPage);
      setHasPrevPage(!!pagination.prevPage);
    } catch (err) {
      console.error("Admin wallet API error:", err);
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

      {showOrderPopUp && (
        <EditOrderUserDetail
          editDetailOrder={editDetailOrder}
          setShowOrderPopUp={setShowOrderPopUp}
          setLoading={setLoading}
          fetchTransactions={fetchTransactions}
        />
      )}
      {showOrderViewPopUp && (
        <ViewOrderUserDetail
          editDetailOrder={editDetailOrder}
          setShowOrderViewPopUp={setShowOrderViewPopUp}
          setLoading={setLoading}
        />
      )}
      <div
        className="wallet-ctm-tab wallet-ctm-tab-active"
        data-id="wallet-ctm-tab1"
      >
        <div className="my-wallet-sec-heading-content">
          <h1 className="common-h1-heading">Transactions</h1>
        </div>

        <div className="my-wallet-table-sec">
          {loading ? (
            <Loader />
          ) : (
            <div className="outer-table">
              <table>
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Product</th>
                    <th>User Name</th>
                    <th>Product type (ring size)</th>
                    <th>Total Amount</th>
                    <th>Address</th>
                    <th>Date Time</th>
                    <th>Order Status</th>
                  </tr>
                </thead>
                <tbody>
                  {walletTransactions.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center" }}>
                        No transactions found.
                      </td>
                    </tr>
                  ) : (
                    walletTransactions.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.productName}</td>

                        <td>
                          <Image
                            width={100}
                            height={100}
                            src={
                              item?.productImg
                                ? process.env.NEXT_PUBLIC_WEBSITE_URL +
                                  item?.productImg
                                : "/user-icon-image.png"
                            }
                            alt=""
                          />
                        </td>
                        <td>{item.addresses?.[0]?.name}</td>
                        <td>
                          {item?.product_type_gem == "Ring"
                            ? item?.ring_size
                            : item?.product_type_gem == "Pendant"
                            ? "Pendant"
                            : "no size"}
                        </td>
                        <td>
                          ₹{" "}
                          {Math.round(item.gstAmount) +
                            Math.round(item.totalAmount)}
                        </td>
                        <td>
                          City: {item.addresses?.[0]?.city}, State:{" "}
                          {item.addresses?.[0]?.state}, Country:{" "}
                          {item.addresses?.[0]?.country}
                        </td>
                        <td>{new Date(item.createdAt).toLocaleString()}</td>

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
                              <button className="delete-btn"
                                onClick={() => {
                                  setEditDetailOrder(item);
                                  setShowOrderPopUp(true);
                                }}
                              >
                                <FaEdit />
                              </button>
                              <button className="delete-btn"
                                onClick={() => {
                                  setEditDetailOrder(item);
                                  setShowOrderViewPopUp(true);
                                }}
                              >
                                <MdOutlineRemoveRedEye />
                              </button>
                              <span>
                                {item?.product_order_complete
                                  ? "Completed"
                                  : item?.product_order_status
                                  ? "Dispatched"
                                  : "Processing"}
                              </span>
                              </div>
                            </>
                          ) : (
                            <>
                              <h4>Order Canceled</h4>
                              <p>
                                <span>Reason Canceled :</span>{" "}
                                <ShowLessShowMore
                                  description={
                                    item?.product_cancel_order_reason
                                  }
                                  totalWord={5}
                                />
                              </p>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="pagination-outer" style={{ marginTop: "10px" }}>
            <button
              onClick={() => setPage((prev) => prev - 1)}
              disabled={!hasPrevPage || loading}
              className={!hasPrevPage ? "disable" : ""}
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={!hasNextPage || loading}
              className={!hasNextPage ? "disable" : ""}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyWalletAstroProduct;
