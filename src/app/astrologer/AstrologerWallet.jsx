"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import Loader from "../component/Loader";
import Cookies from "js-cookie";
import { FaSearch } from "react-icons/fa";
import useDebounce from "../hook/useDebounce";


function AstrologerWallet() {
  
  const [walletAdminData, setWalletAdminData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [totalAvailableBalance, setTotalAvailableBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [astrologerPhone, setAstrologerPhone] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 1000);

  useEffect(() => {
    const astrologerPhones = Cookies.get("astrologer-phone");
    setAstrologerPhone(astrologerPhones);
  }, []);

  const fetchTransactions = async (pageNumber, search = "") => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/chat/transaction-data-astroLoger/${astrologerPhone}?page=${pageNumber}&limit=5&search=${search}`
      );
      setWalletAdminData(data.transactions || []);
      setPage(data.currentPage);
      setTotalPages(data.totalPages);
      setHasNextPage(data.hasNextPage);
      setHasPrevPage(data.hasPrevPage);
      setTotalAvailableBalance(data.totalAvailableBalance);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
  if (astrologerPhone) {
    fetchTransactions(page, debouncedSearch); 
  }
}, [page, astrologerPhone, debouncedSearch]); 


  return (
    <div className="admin-wallet-main">
      <div className="inner-admin-wallet">
        <p>
          Available balance:{" "}
          <span>₹ {Math.round(totalAvailableBalance) || 0}</span>
        </p>
        <div className="search-box-top-btn">
          <div className="search-box-filed">
            <input
              type="search"
              placeholder="Search name or mobile..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="search-button-filed">
            <button type="button">
              <FaSearch />
            </button>
          </div>
        </div>
      </div>
      {loading ? (
        <Loader />
      ) : (
        <div className="outer-table">
          <table>
            <thead>
              <tr>
                {/* <th>ID</th> */}
                <th>User Name</th>
                {/* <th>Available Balance</th> */}
                <th>Transaction Amount</th>
                <th>Description</th>
                <th>Date and Time</th>
              </tr>
            </thead>
            <tbody>
              {walletAdminData.length > 0 ? (
                walletAdminData.map((item) => (
                  <tr key={item._id}>
                    {/* <td>{item._id}</td> */}
                    <td>{item.userName || "N/A"}</td>
                    {/* <td>₹ {Math.round(item.availableBalance)}</td> */}
                    <td>₹ {item.transactionAmount}</td>
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
        </div>
      )}
      <div className="admin-wallet-inner">
        <button
          onClick={() => setPage(page - 1)}
          disabled={!hasPrevPage || loading}
          className={!hasPrevPage && "disable"}
        >
          Previous
        </button>
        <span>
          {" "}
          Page {page} of {totalPages}{" "}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={!hasNextPage || loading}
          className={!hasNextPage && "disable"}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default AstrologerWallet;
