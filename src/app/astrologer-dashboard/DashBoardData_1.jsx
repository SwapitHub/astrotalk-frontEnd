"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const DashBoardData_1 = ({ astrologerData = {} }) => {
  const [isOnline, setIsOnline] = useState(
    !!sessionStorage.getItem("session-astrologer-phone")
  );
  console.log(isOnline);

  const updateAstrologerStatus = useCallback(
    async (status) => {
      try {
        // 1️⃣  update profile
        await axios.put(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}/update-astro-status-by-mobile/${astrologerData.mobileNumber}`,
          { profileStatus: status }
        );

        // 2️⃣  update order/history list
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
    } else {
      sessionStorage.removeItem("session-astrologer-phone");
    }

    updateAstrologerStatus(next);
  };

  // ─────────────────────────────────── mark online once after mount
  useEffect(() => {
    if (isOnline) updateAstrologerStatus(true);
  }, []);

  // ─────────────────────────────────── clean logout on true tab close
  useEffect(() => {
    const handlePageHide = (e) => {
      if (e.persisted) return;

      if (isOnline) {
        updateAstrologerStatus(false);
        sessionStorage.removeItem("session-astrologer-phone");
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
            <div className="astrologer-call-button-ctm">
              <a
                href={
                  astrologerData.chatStatus
                    ? `/chat-with-astrologer/astrologer/${astrologerData._id}`
                    : "#"
                }
              >
                Chat
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
