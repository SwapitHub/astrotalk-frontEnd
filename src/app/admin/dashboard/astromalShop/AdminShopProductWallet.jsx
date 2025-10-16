"use client";
import Loader from "@/app/component/Loader";
import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { FaSearch } from "react-icons/fa";
import debounce from "lodash.debounce";
import Image from "next/image";
import ShowLessShowMore from "@/app/component/ShowLessShowMore";
import CancelOrderPopUp from "@/app/component/CancelOrderPopUp";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import ViewOrderUserDetail from "@/app/component/ViewOrderUserDetail";

function AdminShopProductWallet({ updateButton }) {
  const [walletAdminData, setWalletAdminData] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1); // Use a single page state
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editDetailOrder, setEditDetailOrder] = useState(null);
  const [showOrderViewPopUp, setShowOrderViewPopUp] = useState(false);
  const [cancelOrder, setCancelOrder] = useState({
    orderStatus: false,
    order_id: null,
  });

  // Debounce search input
  const debounceSearchHandler = useCallback(
    debounce((query) => {
      setDebouncedSearch(query);
      setPage(1); // Reset to page 1 on search change
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
            type: updateButton,
            page: page,
            limit: 2, // Adjust the limit here based on your requirement
            search: debouncedSearch,
            productType: "astroProduct",
          },
        }
      );
      console.log(res);

      setWalletAdminData(res.data.orders);
      setTotalPages(Math.ceil(res.data.pagination.totalPages)); // Correct page calculation
      setHasNextPage(res.data.pagination.nextPage);
      setHasPrevPage(page > 1); // Has prev if currentPage > 1
    } catch (err) {
      console.log("API Error:", err);
    } finally {
      setLoading(false);
    }
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

  useEffect(() => {
    if (updateButton) {
      fetchTransactions();
    }
  }, [updateButton, debouncedSearch, page]);

  const handleNext = () => {
    if (!hasNextPage || loading) return;

    setPage(page + 1); // Increment the page when clicking "Next"
  };

  const handlePrevious = () => {
    if (!hasPrevPage || loading) return;

    setPage(page - 1); // Decrement the page when clicking "Previous"
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
      <div className="admin-wallet-main">
        <h1>Shop Product Order List</h1>

        <div className="search-box-top-btn">
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
                  {/* <th>Product Order Id</th> */}
                  <th>User Name</th>
                  {/* <th>User Mobile</th> */}
                  {/* <th>User Status</th> */}
                  <th>Transaction Amount</th>
                  {/* <th>GST</th> */}
                  {/* <th>Product Name</th> */}
                  <th>User Address</th>
                  <th>Date and Time</th>
                  <th>Product type (ring size)</th>
                  <th>Gemstone Product Amount</th>
                  {/* <th>Product</th> */}
                  <th>Product Order Status</th>
                </tr>
              </thead>
              <tbody>
                {walletAdminData?.map((item) => (
                  <tr key={item._id}>
                    {/* <td>{item?.order_id}</td> */}
                    <td>{item.addresses[0]?.name}</td>
                    {/* <td>{item.userMobile}</td> */}
                    {/* <td>{item.status}</td> */}
                    <td>
                      ₹{" "}
                      {Math.round(item.totalAmount) +
                        Math.round(item.gstAmount) +
                        Math.round(item.gemStone_product_price)}
                    </td>
                    {/* <td>₹ {item.gstAmount}</td> */}
                    {/* <td>{item.productName}</td> */}
                    <td>
                      City - {item.addresses[0]?.city}, State -{" "}
                      {item.addresses[0]?.state}
                    </td>
                    <td>{new Date(item.createdAt).toLocaleString()}</td>
                    <td>{item?.product_type_gem || "no size"}</td>
                    <td>
                      ₹{" "}
                      {Math.round(item?.totalAmount) -
                        Math.round(item?.gemStone_product_price)}
                    </td>
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
                                updateOrderStatus(item?.order_id, false, false);
                              } else if (selected === "dispatched") {
                                updateOrderStatus(item?.order_id, true, false);
                              } else if (selected === "completed") {
                                updateOrderStatus(item?.order_id, true, true);
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
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 0 ? (
          <div className="admin-wallet-inner">
            <button
              onClick={handlePrevious}
              disabled={!hasPrevPage || loading}
              className={!hasPrevPage ? "disable" : ""}
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={!hasNextPage || loading}
              className={!hasNextPage ? "disable" : ""}
            >
              Next
            </button>
          </div>
        ) : (
          <p className="data-not-found">Data Not Found</p>
        )}
      </div>
    </>
  );
}

export default AdminShopProductWallet;
