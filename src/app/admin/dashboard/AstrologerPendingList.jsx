"use client";
import Loader from "@/app/component/Loader";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import secureLocalStorage from "react-secure-storage";

function AstrologerPendingList() {
  const [pendingData, setPendingData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchAstrologers = async (pageNumber) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/astrologer-list?astroStatus=false&page=${pageNumber}&limit=5`
      );
      console.log(res.data.totalAstrologers);

      setPendingData(res.data.astrologers);

      setPage(res.data.page);
      setTotalPages(res.data.totalPages);
      setHasNextPage(res.data.hasNextPage);
      setHasPrevPage(res.data.hasPrevPage);
      secureLocalStorage.setItem(
        "totalAstroPending",
        res.data.totalAstrologers
      );
    } catch (err) {
      console.log("Fetch astrologers error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAstrologers(page);
  }, [page]);

  const updateAstrologerStatus = async (id, newStatus, name, mobile, email) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/update-astro-status/${id}`,
        { astroStatus: newStatus }
      );
      fetchAstrologers(page);

      if (response.status == "200") {
        try {
          await axios.post(
            `${process.env.NEXT_PUBLIC_WEBSITE_URL}/send-registration-email`,
            {
              name,
              mobile,
              email,
            }
          );
        } catch {
          console.log("email api error");
        }
      }
    } catch (error) {
      console.error(
        "Failed to update astrologer status:",
        error.response?.data?.error || error.message
      );
    }
  };

  const deleteAstrologer = async (mobile) => {
    try {
      const result = await axios.delete(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/delete-astrologer-list/${mobile}`
      );

      if (result.status === 200) {
        fetchAstrologers();
      }
    } catch (err) {
      console.log("API error", err.response || err.message);
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
                <th>Mobile Number</th>
                <th>Aadhar Card</th>
                <th>Certificate</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingData.map((item) => (
                <tr key={item._id}>
                  <td>{item._id}</td>
                  <td>{item.name}</td>
                  <td>{item?.mobileNumber}</td>
                  <td>
                    <Link href={`${item?.aadhaarCard}`} target="_blank">
                      <img src={item?.aadhaarCard} alt={item.name} />
                    </Link>
                  </td>
                  <td>
                    <Link href={`${item?.certificate}`} target="_blank">
                      <img src={item?.certificate} alt={item.name} />
                    </Link>
                  </td>

                  <td>
                    <button
                      onClick={() =>
                        updateAstrologerStatus(
                          item._id,
                          true,
                          item.name,
                          item.mobileNumber,
                          item.email
                        )
                      }
                     
                    >
                      {item.astroStatus ? "Active" : "Confirm"}
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

export default AstrologerPendingList;
