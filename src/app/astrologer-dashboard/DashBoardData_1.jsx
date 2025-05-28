"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const DashBoardData_1 = ({ astrologerData = {} }) => {
  const [isOnline, setIsOnline] = useState(false);


  useEffect(() => {
    if (isOnline) {
      document.body.classList.add("showOnline");
    } else {
      document.body.classList.remove("showOnline");
    }
  }, [isOnline]);

  // ✅ Load from sessionStorage only on client
  useEffect(() => {
    const sessionPhone = sessionStorage.getItem("session-astrologer-phone");
    if (sessionPhone === astrologerData.mobileNumber) {
      setIsOnline(true);
    }
  }, [astrologerData.mobileNumber]);

  const updateAstrologerStatus = useCallback(
    async (status) => {
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
    [astrologerData.mobileNumber]
  );

  const toggleOnlineStatus = async () => {
    const next = !isOnline;
    setIsOnline(next);

    if (next) {
      sessionStorage.setItem(
        "session-astrologer-phone",
        astrologerData.mobileNumber
      );
    } 

    updateAstrologerStatus(next);
  };

  // ✅ Mark online after mount if already marked
  useEffect(() => {
    if (isOnline) {
      updateAstrologerStatus(true);
    }
  }, [isOnline, updateAstrologerStatus]);

  // ✅ Handle tab close
  useEffect(() => {
    const handlePageHide = (e) => {
      if (e.persisted) return;

      if (isOnline) {
        updateAstrologerStatus(false);
      }
    };

    window.addEventListener("pagehide", handlePageHide);
    return () => window.removeEventListener("pagehide", handlePageHide);
  }, [isOnline, updateAstrologerStatus]);

  return (
    <section className="astrologer-registration-bg">
      <div className="container">
        <div className="inner-astrologer-registration">
          <div className="registration-heading">
            <div className="image-dash">
              <img
                src="https://d1gcna0o0ldu5v.cloudfront.net/fit-in/320x410/assets/images/login_banner.webp"
                alt=""
              />
            </div>
            <div className="astrologer-main-dashboard-btn">
              <a
                href={
                  astrologerData.chatStatus
                    ? `/chat-with-astrologer/astrologer/${astrologerData._id}`
                    : "#"
                }
              >
                Back To The Chat Page
              </a>
              <button onClick={toggleOnlineStatus}>
                {isOnline ? "Go Offline" : "Go Online"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashBoardData_1;
