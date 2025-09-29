"use client";
import Loader from "@/app/component/Loader";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaEdit, FaSearch } from "react-icons/fa";
import { MdDelete, MdPreview } from "react-icons/md";
import secureLocalStorage from "react-secure-storage";
import AstroDetail from "./AstroDetail";

function AstrologerPendingList() {
  const [pendingData, setPendingData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [loading, setLoading] = useState(false);
 const [addActiveClass, setAddActiveClass] = useState(false);
  const [astroMobileNumber, setAstroMobileNumber] = useState();
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
                <th>Aadhar Card</th>
                <th>Certificate</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {pendingData.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item?.mobileNumber}</td>
                  <td>{new Date(item.createdAt).toLocaleString()}</td>
                  <td>{item?.charges || 0 }</td>
                  <td>
                    <Link
                      href={`${
                        process.env.NEXT_PUBLIC_WEBSITE_URL + item?.aadhaarCard
                      }`}
                      target="_blank"
                    >
                      <Image
                        width={100}
                        height={100}
                        src={
                          process.env.NEXT_PUBLIC_WEBSITE_URL +
                          item?.aadhaarCard
                        }
                        alt="user-icon"
                      />
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`${
                        process.env.NEXT_PUBLIC_WEBSITE_URL + item?.certificate
                      }`}
                      target="_blank"
                    >
                      <Image
                        width={100}
                        height={100}
                        src={
                          process.env.NEXT_PUBLIC_WEBSITE_URL +
                          item?.certificate
                        }
                        alt="user-icon"
                      />
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
                    <button className="delete-btn"   onClick={() => {
                        setAddActiveClass(true);
                        setAstroMobileNumber(item.mobileNumber)
                      }}>
                      <MdPreview />
                    </button>
                    <button className="delete-btn">
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
