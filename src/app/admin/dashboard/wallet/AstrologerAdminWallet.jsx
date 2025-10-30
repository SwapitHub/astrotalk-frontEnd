"use client";
import Loader from "@/app/component/Loader";
import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { FaEdit, FaSearch } from "react-icons/fa";
import debounce from "lodash.debounce";
import { MdDelete, MdOutlineRemoveRedEye } from "react-icons/md";
import DeletePopUp from "@/app/component/DeletePopUp";
import Image from "next/image";
import WalletView from "./WalletViewAstro";
import WalletEditAstro from "./WalletEditAstro";

function AstrologerAdminWallet() {
  let showNameData = "Astrologer";

  const [walletAdminData, setWalletAdminData] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [addActiveClass, setAddActiveClass] = useState(false);
  const [addActiveClassEdit, setAddActiveClassEdit] = useState(false);
  const [mobileNumber, setMobileNumber] = useState();
  const [showDelete, setShowDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState();
  const [deletePermanently, setDeletePermanently] = useState(false);

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
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/get-all-astrologer-with-wallet`,
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

  const updateBlockUnblockUser = async (phone) => {
    try {
      setLoading(true);

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/update-business-profile/${phone}`,
        {
          blockUnblockAstro: true,
          deleteAstroLoger: true,
        }
      );

      if (response?.data.message == "Success") {
        fetchTransactions(); // Refresh the data after the action
        setDeletePermanently(false);

        console.log(`User ${phone} has been blocked and deleted successfully.`);
      } else {
        console.error("Failed to block and delete user.");
      }
    } catch (error) {
      console.error(
        "Error blocking and deleting user:",
        error.response?.data?.error || error.message
      );
    } finally {
      setLoading(false); // Set loading state to false when done
    }
  };

  console.log(userToDelete, deletePermanently, "ewewew");

  useEffect(() => {
    if (userToDelete && deletePermanently) {
      updateBlockUnblockUser(userToDelete);
    }
  }, [deletePermanently, userToDelete]);

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

  useEffect(() => {
    if (addActiveClassEdit) {
      document.body.classList.add("wallet-edit-popup");
    } else {
      document.body.classList.remove("wallet-edit-popup");
    }
  }, [addActiveClassEdit]);

  return (
    <>
      {showDelete && (
        <DeletePopUp
          setShowDelete={setShowDelete}
          setDeletePermanently={setDeletePermanently}
          showNameData={showNameData}
        />
      )}
      {addActiveClassEdit && (
        <WalletEditAstro
          mobileNumber={mobileNumber}
          setAddActiveClassEdit={setAddActiveClassEdit}
          fetchTransactions={fetchTransactions}
          setLoading={setLoading}
        />
      )}
      {addActiveClass && (
        <WalletView
          mobileNumber={mobileNumber}
          setAddActiveClass={setAddActiveClass}
          setLoading={setLoading}
        />
      )}

      <div className="admin-wallet-main">
        <h1>Astrologer Wallet List</h1>
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
                  <th>Image</th>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Charges</th>
                  <th>Total Amount</th>
                  <th>Experience</th>
                  {/* <th>Date & Time</th> */}
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {walletAdminData?.length > 0 ? (
                  walletAdminData.map((user) => {
                    return (
                      <>
                        
                          <tr key={user._id}>
                            <td>
                              {" "}
                              <Image
                                width={100}
                                height={100}
                                src={
                                  user?.profileImage
                                    ? process.env.NEXT_PUBLIC_WEBSITE_URL +
                                      user?.profileImage
                                    : "/user-icon-image.png"
                                }
                                alt="user-icon"
                              />
                            </td>
                            <td>{user.name}</td>
                            <td>{user.mobileNumber}</td>
                            <td>₹ {user.charges}</td>
                            <td>
                              ₹ {Math.round(user.totalAvailableBalance) || 0}
                            </td>
                            <td>{user.experience} year</td>
                            {/* <td>
                              {new Date(user?.createdAt).toLocaleString()}
                            </td> */}
                            <td>
                              <button
                                className="delete-btn"
                                onClick={() => {
                                  setAddActiveClass(true);
                                  setMobileNumber(user.mobileNumber);
                                }}
                              >
                                <MdOutlineRemoveRedEye />
                              </button>
                              <button
                                className="delete-btn"
                                onClick={() => {
                                  setAddActiveClassEdit(true);
                                  setMobileNumber(user.mobileNumber);
                                }}
                              >
                                <FaEdit />
                              </button>
                              <button
                                className="delete-btn"
                                onClick={() => {
                                  setUserToDelete(user?.mobileNumber);
                                  setShowDelete(true);
                                }}
                              >
                                <MdDelete />
                              </button>
                            </td>
                          </tr>
                        
                      </>
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

export default AstrologerAdminWallet;
