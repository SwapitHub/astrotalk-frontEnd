"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Link from "next/link";
import { TfiGallery } from "react-icons/tfi";
import { IoWalletSharp } from "react-icons/io5";
import { MdOutlinePreview } from "react-icons/md";
import { ImProfile } from "react-icons/im";
import { IoIosArrowRoundBack } from "react-icons/io";

const DashBoardData_1 = ({ astrologerData = {}, setUpdateButton }) => {
  const [isOnline, setIsOnline] = useState(false);

  // ✅ Apply online CSS class based on status
  useEffect(() => {
    document.body.classList.toggle("showOnline", isOnline);
  }, [isOnline]);

  // ✅ Load session status from client storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const sessionPhone = sessionStorage.getItem("session-astrologer-phone");
      if (sessionPhone === astrologerData?.mobileNumber) {
        setIsOnline(true);
      }
    }
  }, [astrologerData?.mobileNumber]);

  // ✅ Function to update status to backend
  const updateAstrologerStatus = useCallback(
    async (status) => {
      if (!astrologerData?.mobileNumber) return;
      try {
        await axios.put(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}/update-astro-status-by-mobile/${astrologerData.mobileNumber}`,
          { profileStatus: status }
        );

        await axios.put(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}/userId-to-astrologer-astro-list-update`,
          {
            mobileNumber: astrologerData.mobileNumber,
            profileStatus: status,
          }
        );
      } catch (err) {
        console.error(
          "Failed to update astrologer status:",
          err.response?.data?.error || err.message
        );
      }
    },
    [astrologerData?.mobileNumber]
  );

  // ✅ Toggle online/offline status
  const toggleOnlineStatus = async () => {
    const nextStatus = !isOnline;
    setIsOnline(nextStatus);

    if (nextStatus) {
      sessionStorage.setItem("session-astrologer-phone", astrologerData.mobileNumber);
    } else {
      sessionStorage.removeItem("session-astrologer-phone");
    }

    await updateAstrologerStatus(nextStatus);
  };

  // ✅ Update backend when `isOnline` changes (skip initial mount)
  useEffect(() => {
    if (astrologerData?.mobileNumber) {
      updateAstrologerStatus(isOnline);
    }
  }, [isOnline, updateAstrologerStatus]);

  // ✅ Mark offline when tab is closed or reloaded
  useEffect(() => {
    const handlePageHide = (e) => {
      if (!e.persisted && isOnline) {
        updateAstrologerStatus(false);
      }
    };
    window.addEventListener("pagehide", handlePageHide);
    return () => window.removeEventListener("pagehide", handlePageHide);
  }, [isOnline, updateAstrologerStatus]);

  return (
    <section className="astrologer-registration-bg">
      <div className="container">
        <div className="astro-dashboard-heading-btns-outer">
          <div className="home-dashboard-heading">
            <h2>Dashboard</h2>
            <p>Astrotalk Panel</p>
          </div>

          <div className="inner-astrologer-registration">
            <div className="registration-heading">
              <div className="astrologer-main-dashboard-btn">
                <a
                  href={
                    astrologerData?.chatStatus
                      ? `/chat-with-astrologer/astrologer/${astrologerData._id}`
                      : "#"
                  }
                >
                  <span>
                    <IoIosArrowRoundBack />
                  </span>{" "}
                  Back To The Chat Page
                </a>

                <button onClick={toggleOnlineStatus}>
                  {isOnline ? "Go Offline" : "Go Online"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="outer-home-dashboard">
          <div className="inner-home-dashboard">
            <ul>
              <li>
                <Link href="#" onClick={() => setUpdateButton(2)}>
                  <span><ImProfile /></span>
                  <div className="inner-text"><span>Profile</span></div>
                </Link>
              </li>
              <li>
                <Link href="#" onClick={() => setUpdateButton(3)}>
                  <span><IoWalletSharp /></span>
                  <div className="inner-text"><span>Wallet</span></div>
                </Link>
              </li>
              <li>
                <Link href="#" onClick={() => setUpdateButton(5)}>
                  <span><MdOutlinePreview /></span>
                  <div className="inner-text"><span>Review</span></div>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <span><TfiGallery /></span>
                  <div className="inner-text"><span>Gallery</span></div>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashBoardData_1;
