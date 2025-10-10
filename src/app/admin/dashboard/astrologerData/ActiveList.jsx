"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "@/app/component/Loader";
import { FaEdit, FaSearch } from "react-icons/fa";
import { MdDelete, MdOutlineRemoveRedEye } from "react-icons/md";
import secureLocalStorage from "react-secure-storage";
import AstroDetail from "./AstroDetailView";
import AstroDetailEdit from "./AstroDetailEdit";
import useDebounce from "@/app/hook/useDebounce";
import DeletePopUp from "@/app/component/DeletePopUp";

function ActiveList() {
  let showNameData = "Astrologer";

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

  const [showDelete, setShowDelete] = useState(false);
  const [deletePermanently, setDeletePermanently] = useState(false);
  const [totalCount, setTotalCount] = useState();


  const [astroToDelete, setAstroToDelete] = useState({
    id: null,
    mobile: null,
  });

  // ✅ Fetch astrologers
  const fetchAstrologers = async (pageNumber = 1, search = "") => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/astrologer-businessProfile`,
        {
          params: {
            profileStatus: true,
            page: pageNumber,
            limit: 5,
            name: search,
          },
        }
      );

      const data = res.data;

      setPendingData(data.profiles || []);
      setTotalCount(data.total)

      setPage(data.currentPage);
      setTotalPages(data.totalPages);
      setHasNextPage(data.currentPage < data.totalPages);
      setHasPrevPage(data.currentPage > 1);
    } catch (err) {
      console.log("Fetch astrologers error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Initial + watch page/search
  useEffect(() => {
    fetchAstrologers(page, debouncedSearch);
  }, [page, debouncedSearch]);

  // ✅ Update block/unblock status
  const updateBlockUnblockAstro = async (mobileNumber, status) => {
    
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/update-business-profile/${mobileNumber}`,
        { 
            blockUnblockAstro: status ,
            profileStatus: false,
            deleteAstroLoger: true
        
        }
      );
      fetchAstrologers(page);
    } catch (error) {
      console.error("Block/unblock failed:", error.response?.data || error.message);
    }
  };

  // ✅ Delete astrologer
 const deleteAstrologer = async () => {
  if (!astroToDelete.mobile || !astroToDelete.id) return;

  setLoading(true);

  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_WEBSITE_URL}/update-business-profile/${astroToDelete.mobile}`,
      {
        deleteAstroLoger: true,
        blockUnblockAstro: true,
        profileStatus: false,
      }
    );

    if (response.status === 200) {
      console.log("Astrologer deleted successfully.");
      await fetchAstrologers(page); // Refresh the list
    } else {
      console.error("Unexpected response:", response);
    }
  } catch (err) {
    console.error("Delete error:", err.response?.data || err.message);
  } finally {
    setShowDelete(false);
    setDeletePermanently(false);
    setAstroToDelete({ id: null, mobile: null });
    setLoading(false);
  }
};


  useEffect(() => {
    if (deletePermanently && astroToDelete.mobile && astroToDelete.id) {
      deleteAstrologer();
    }
  }, [deletePermanently]);

  useEffect(() => {
    document.body.classList.toggle("astro-detail-admin-popup", addActiveClass);
  }, [addActiveClass]);

  useEffect(() => {
    document.body.classList.toggle("astro-detail-admin-edit-popup", addActiveClassEdit);
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

      <AstroDetailEdit
        astroMobileNumber={astroMobileNumber}
        setAddActiveClassEdit={setAddActiveClassEdit}
        setLoading={setLoading}
        checkCompleteProfile={checkCompleteProfile}
        fetchAstrologers={fetchAstrologers}
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
          <div className="main-pending-list">
            <h1>Astrologer Active List</h1>
            <div className="outer-total-count">
                <div className="list-total">Total active Astrologer : {totalCount}</div>
            
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
                {pendingData?.length > 0 ? (
                  pendingData.map((item) => (
                    <tr key={item._id}>
                      <td>{item.name}</td>
                      <td>{item.mobileNumber}</td>
                      <td>{new Date(item.createdAt).toLocaleString()}</td>
                      <td>{item?.charges || 0}</td>
                      <td>
                        {/* <button
                          onClick={() =>
                            updateBlockUnblockAstro(
                              item.mobileNumber,
                              !item?.blockUnblockAstro
                            )
                          }
                        >
                          {item?.blockUnblockAstro ? "Unblock" : "Block"}
                        </button> */}
                        <button
                          className="delete-btn"
                          onClick={() => {
                            setAddActiveClass(true);
                            setAstroMobileNumber(item.mobileNumber);
                            setCheckCompleteProfile(item?.completeProfile);
                          }}
                        >
                          <MdOutlineRemoveRedEye />
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
                            setAstroToDelete({
                              id: item._id,
                              mobile: item.mobileNumber,
                            });
                            setShowDelete(true);
                          }}
                        >
                          <MdDelete />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {totalPages > 1 && (
        <div className="admin-wallet-inner">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={!hasPrevPage || loading}
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={!hasNextPage || loading}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}

export default ActiveList;
