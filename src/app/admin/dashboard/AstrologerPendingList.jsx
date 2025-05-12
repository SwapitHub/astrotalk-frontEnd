"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";

function AstrologerPendingList() {
  const [pendingData, setPendingData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);

  const fetchAstrologers = async (pageNumber) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/astrologer-list?astroStatus=false&page=${pageNumber}&limit=2`
      );

      setPendingData(res.data.astrologers);
      setPage(res.data.page);
      setTotalPages(res.data.totalPages);
      setHasNextPage(res.data.hasNextPage);
      setHasPrevPage(res.data.hasPrevPage);
    } catch (err) {
      console.log("Fetch astrologers error:", err);
    }
  };

  useEffect(() => {
    fetchAstrologers(page);
  }, [page]);

  const updateAstrologerStatus = async (id, newStatus) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/update-astro-status/${id}`,
        { astroStatus: newStatus }
      );
      fetchAstrologers(page); // refresh data after status change
    } catch (error) {
      console.error(
        "Failed to update astrologer status:",
        error.response?.data?.error || error.message
      );
    }
  };

  return (
    <div>
      <table border="1" cellPadding="8" style={{ marginBottom: "20px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {pendingData.map((item) => (
            <tr key={item._id}>
              <td>{item._id}</td>
              <td>{item.name}</td>
              <td>
                <button
                  onClick={() => updateAstrologerStatus(item._id, true)}
                  style={{
                    backgroundColor: item.astroStatus ? "green" : "orange",
                    color: "white",
                    padding: "4px 10px",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  {item.astroStatus ? "Active" : "Pending"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <button
          onClick={() => setPage(page - 1)}
          disabled={!hasPrevPage}
          style={{ padding: "6px 12px" }}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={!hasNextPage}
          style={{ padding: "6px 12px" }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default AstrologerPendingList;
