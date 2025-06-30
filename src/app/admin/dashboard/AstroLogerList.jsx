"use client";
import Loader from "@/app/component/Loader";
import axios from "axios";
import React, { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";

function AstroLogerList() {
  const [pendingData, setPendingData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [loading, setLoading] = useState(false);

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

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="outer-table">
          <table border="1" cellPadding="8" style={{ marginBottom: "20px" }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Phone Number</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {pendingData?.map((item) => (
                <tr key={item._id}>
                  <td>{item._id}</td>
                  <td>{item.name}</td>
                  <td>{item.mobileNumber}</td>
                  <td>
                    <button
                      onClick={() => updateBlockUnblockAstro(item._id, item?.blockUnblockAstro ? false : true)}
                    >
                      {item?.blockUnblockAstro ? "Unblock" : "Block"}
                      
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
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
    </>
  );
}

export default AstroLogerList;
