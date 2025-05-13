"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";

function AstroLogerList() {
  const [pendingData, setPendingData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);

  const fetchAstrologers = async (pageNumber) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/astrologer-list?astroStatus=true&page=${pageNumber}&limit=2`
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

  return (
    <div>
      <table border="1" cellPadding="8" style={{ marginBottom: "20px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {pendingData?.map((item) => (
            <tr key={item._id}>
              <td>{item._id}</td>
              <td>{item.name}</td>
              <td>{item.mobileNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="admin-wallet-inner">
        <button
          onClick={() => setPage(page - 1)}
          disabled={!hasPrevPage}
         
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

export default AstroLogerList;
