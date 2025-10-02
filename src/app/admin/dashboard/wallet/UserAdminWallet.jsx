"use client";
import Loader from "@/app/component/Loader";
import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { FaEdit, FaSearch } from "react-icons/fa";
import debounce from "lodash.debounce";
import { MdDelete, MdPreview } from "react-icons/md";
import WalletView from "./WalletView";

function UserAdminWallet() {
  const [walletAdminData, setWalletAdminData] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [addActiveClass, setAddActiveClass] = useState();
  const [mobileNumber, setMobileNumber] = useState();

  // Debounce search input
  const debounceSearch = useCallback(
    debounce((query) => {
      setDebouncedSearch(query);
      setCurrentPage(1); // reset to page 1 on new search
    }, 500),
    []
  );

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchName(query);
    debounceSearch(query);
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/get-all-users-with-wallet`,
        {
          params: {
            page: currentPage,
            limit: 5,
            search: debouncedSearch,
          },
        }
      );

      const { data, totalPages } = res.data;

      setWalletAdminData(data);
      setTotalPages(totalPages || 1);
    } catch (err) {
      console.error("Admin wallet API error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [currentPage, debouncedSearch]);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };
  useEffect(() => {
    if (addActiveClass) {
      document.body.classList.add("wallet-view-popup");
    } else {
      document.body.classList.remove("wallet-view-popup");
    }
  }, [addActiveClass]);

  return (
    <>
        <WalletView
        mobileNumber={mobileNumber}
        setAddActiveClass={setAddActiveClass}
        setLoading={setLoading}
      />
      <div className="admin-wallet-main">      
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
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Total Amount</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {walletAdminData?.length > 0 ? (
                  walletAdminData.map((user) => {
                    return (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.phone}</td>
                        <td>{user.totalAmount}</td>
                        <td>{new Date(user?.createdAt).toLocaleString()}</td>
                        <td>
                          <button
                            className="delete-btn"
                            onClick={() => {
                              setAddActiveClass(true);
                              setMobileNumber(user.phone);
                            }}
                          >
                            <MdPreview />
                          </button>
                          <button
                            className="delete-btn"
                            // onClick={() => {
                            //   setAddActiveClassEdit(true);
                            //   setAstroMobileNumber(item.mobileNumber);
                            //   setCheckCompleteProfile(item?.completeProfile);
                            // }}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="delete-btn"
                            // onClick={() => {
                            //   deleteAstrologer(item.mobileNumber);
                            // }}
                          >
                            <MdDelete />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="data-not-found">
                      No Data Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="admin-wallet-inner">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1 || loading}
              className={currentPage === 1 ? "disable" : ""}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages || loading}
              className={currentPage === totalPages ? "disable" : ""}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default UserAdminWallet;
