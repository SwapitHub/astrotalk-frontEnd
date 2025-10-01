"use client";
import Loader from "@/app/component/Loader";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaEdit, FaSearch } from "react-icons/fa";
import { MdDelete, MdPreview } from "react-icons/md";
import secureLocalStorage from "react-secure-storage";
import AstroDetail from "./AstroDetailView";
import AstroDetailEdit from "./AstroDetailEdit";
import useDebounce from "@/app/hook/useDebounce";

function AstroLogerList() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 1000);

  const [pendingData, setPendingData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addActiveClass, setAddActiveClass] = useState(false);
  const [addActiveClassEdit, setAddActiveClassEdit] = useState(false);

  const [astroMobileNumber, setAstroMobileNumber] = useState();
  const [checkCompleteProfile, setCheckCompleteProfile] = useState();

  const fetchAstrologers = async (pageNumber = 1, search = "") => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/astrologer-list`,
        {
          params: {
            astroStatus: true,
            page: pageNumber,
            limit: 5,
            search: search,
          },
        }
      );

      setPendingData(res.data.astrologers);
      secureLocalStorage.setItem("totalAstroActive", res.data.totalAstrologers);
      setPage(res.data.page);
      setTotalPages(res.data.totalPages);
      setHasNextPage(res.data.hasNextPage);
      setHasPrevPage(res.data.hasPrevPage);
    } catch (err) {
      console.log("Fetch astrologers error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAstrologers(page, debouncedSearch);
  }, [page, debouncedSearch]);

  const updateBlockUnblockAstro = async (id, status) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/update-astro-status/${id}`,
        { blockUnblockAstro: status }
      );
      fetchAstrologers(page);
      console.log(response, "response");
    } catch (error) {
      console.error(
        "Failed to update blockUnblockAstro status:",
        error.response?.data?.error || error.message
      );
    }
  };
  const deleteAstrologer = async (mobile) => {
    try {
      const result = await axios.put(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/put-any-field-astrologer-registration/${mobile}`,
        {
          deleteAstroLoger: true,
        }
      );

      if (result.status === 200) {
        fetchAstrologers();
      }
    } catch (err) {
      console.log("API error", err.response || err.message);
    }
  };
  useEffect(() => {
    if (addActiveClass) {
      document.body.classList.add("astro-detail-admin-popup");
    } else {
      document.body.classList.remove("astro-detail-admin-popup");
    }
  }, [addActiveClass]);

  useEffect(() => {
    if (addActiveClassEdit) {
      document.body.classList.add("astro-detail-admin-edit-popup");
    } else {
      document.body.classList.remove("astro-detail-admin-edit-popup");
    }
  }, [addActiveClassEdit]);
  return (
    <>
      <AstroDetailEdit
        astroMobileNumber={astroMobileNumber}
        setAddActiveClassEdit={setAddActiveClassEdit}
        setLoading={setLoading}
        checkCompleteProfile={checkCompleteProfile}
      />
      <AstroDetail
        astroMobileNumber={astroMobileNumber}
        setAddActiveClass={setAddActiveClass}
        setLoading={setLoading}
        checkCompleteProfile={checkCompleteProfile}
      />
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="search-box-top-btn">
            <div className="search-box-filed">
              <input
                type="search"
                id="astrologer-search"
                name="astrologer-search"
                placeholder="Search name or mobile..."
                aria-label="Search wallet transactions"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1); // reset to first page on new search
                }}
              />
            </div>
            <div className="search-button-filed">
              <button type="button">
                <FaSearch />
              </button>
            </div>
          </div>
          <div className="outer-table">
            <table border="1" cellPadding="8" style={{ marginBottom: "20px" }}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Mobile Number</th>
                  <th>Date Registration</th>
                  <th>Rate per minute</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {pendingData?.map(
                  (item) =>
                    item?.deleteAstroLoger == false && (
                      <tr key={item._id}>
                        <td>{item.name}</td>
                        <td>{item.mobileNumber}</td>
                        <td>{new Date(item.createdAt).toLocaleString()}</td>
                        <td>{item?.charges || 0} </td>
                        <td>
                          <button
                            onClick={() =>
                              updateBlockUnblockAstro(
                                item._id,
                                item?.blockUnblockAstro ? false : true
                              )
                            }
                          >
                            {item?.blockUnblockAstro ? "Unblock" : "Block"}
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => {
                              setAddActiveClass(true);
                              setAstroMobileNumber(item.mobileNumber);
                              setCheckCompleteProfile(item?.completeProfile);
                            }}
                          >
                            <MdPreview />
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => {
                              setAddActiveClassEdit(true);
                              setAstroMobileNumber(item.mobileNumber);
                              setCheckCompleteProfile(item?.completeProfile);
                            }}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => {
                              deleteAstrologer(item.mobileNumber);
                            }}
                          >
                            <MdDelete />
                          </button>
                        </td>
                      </tr>
                    )
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
      {totalPages > 0 ? (
        <div className="admin-wallet-inner">
          <button
            onClick={() => setPage(page - 1)}
            disabled={!hasPrevPage || loading}
            className={!hasPrevPage ? "disable" : ""}
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={!hasNextPage || loading}
            className={!hasNextPage ? "disable" : ""}
          >
            Next
          </button>
        </div>
      ) : (
        <p className="data-not-found">Data Not Found</p>
      )}
    </>
  );
}

export default AstroLogerList;
