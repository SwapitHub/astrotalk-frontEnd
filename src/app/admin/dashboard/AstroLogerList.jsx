"use client";
import Loader from "@/app/component/Loader";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaEdit, FaSearch } from "react-icons/fa";
import { MdDelete, MdPreview } from "react-icons/md";
import secureLocalStorage from "react-secure-storage";
import AstroDetail from "./AstroDetail";

function AstroLogerList() {
  const [pendingData, setPendingData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addActiveClass, setAddActiveClass] = useState(false);
  const [astroMobileNumber, setAstroMobileNumber] = useState();

  const fetchAstrologers = async (pageNumber) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/astrologer-list?astroStatus=true&page=${pageNumber}&limit=5`
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
    fetchAstrologers(page);
  }, [page]);

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

  useEffect(() => {
    if (addActiveClass) {
      document.body.classList.add("astro-detail-admin-popup");
    } else {
      document.body.classList.remove("astro-detail-admin-popup");
    }
  }, [addActiveClass]);
  
  return (
    <>
      <AstroDetail astroMobileNumber={astroMobileNumber} setAddActiveClass={setAddActiveClass}/>
      {loading ? (
        <Loader />
      ) : (
        <div className="outer-table">
          <div className="search-box-top-btn">
            <div className="search-box-filed">
              <input
                type="search"
                id="astrologer-search"
                name="astrologer-search"
                placeholder="Search name or mobile..."
                aria-label="Search wallet transactions"
              />
            </div>
            <div className="search-button-filed">
              <button type="button">
                <FaSearch />
              </button>
            </div>
          </div>
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
              {pendingData?.map((item) => (
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
                        setAstroMobileNumber(item.mobileNumber)
                      }}
                    >
                      <MdPreview />
                    </button>
                    <button className="delete-btn">
                      <FaEdit />
                    </button>
                    <button className="delete-btn">
                      <MdDelete />
                    </button>
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
