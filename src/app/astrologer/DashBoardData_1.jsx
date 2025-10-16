"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Link from "next/link";
import { TfiGallery } from "react-icons/tfi";
import { IoWalletSharp } from "react-icons/io5";
import { MdOutlinePreview } from "react-icons/md";
import { ImProfile } from "react-icons/im";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useRouter } from "next/navigation";

const DashBoardData_1 = ({ astrologerData = {}, setUpdateButton }) => {
    const router = useRouter();
  
  const [isOnline, setIsOnline] = useState();
  const [sessionValue, setSessionValue] = useState();
  console.log("astrologerData", astrologerData);

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
    const isSameUser = sessionPhone === astrologerData?.mobileNumber;
    const isBlocked = astrologerData?.blockUnblockAstro === true;
    const isDeleted = astrologerData?.deleteAstroLoger === true;
    console.log(isSameUser && (!isBlocked || !isDeleted));

    if (isSameUser && (!isBlocked || !isDeleted)) {
      setIsOnline(astrologerData.profileStatus);
      setSessionValue(sessionPhone);
    }
  }, [astrologerData.mobileNumber]);

  const updateAstrologerStatus = useCallback(
    async (status) => {
      try {
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}/update-astro-status-by-mobile/${astrologerData.mobileNumber}`,
          { profileStatus: status }
        );
        if (
          response.data.updatedProfile?.deleteAstroLoger ||
          response.data.updatedProfile?.blockUnblockAstro
        ) {
          setTimeout(() => {
            window.location.reload();
            router.push("/");
          }, 1000);
        }

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
      <div className="astro-dashboard-heading-btns-outer">
        <div className="home-dashboard-heading">
          <h2>Dashboard</h2>
          <p>Astrowb Panel</p>
        </div>

        <div className="inner-astrologer-registration">
          <div className="registration-heading">
            {/* <div className="image-dash">
              <img
                src="https://d1gcna0o0ldu5v.cloudfront.net/fit-in/320x410/assets/images/login_banner.webp"
                alt=""
              />
            </div> */}
            <div className="astrologer-main-dashboard-btn">
              <a
                href={
                  astrologerData.chatStatus
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
      <div className="astro-detail">
        <div className="astrologer-name">
          <span>Astrologer Name:</span>{" "}
          <span className="value">{astrologerData?.name}</span>
        </div>
        <div className="astrologer-charges">
          <span>Astrologer Charges:</span>{" "}
          <span className="value">₹ {astrologerData?.charges}</span>
        </div>
        <div className="astrologer-bal">
          <span>Total Balance:</span>{" "}
          <span className="value">
            ₹{Math.round(astrologerData?.totalAvailableBalance) || 0}
          </span>
        </div>
      </div>
      <div className="outer-home-dashboard">
        <div className="inner-home-dashboard">
          <ul>
            <li onClick={() => setUpdateButton(2)}>
              <span>
                <ImProfile />
              </span>
              <div className="inner-text">
                <span> Profile</span>
                {/* <span>123</span> */}
              </div>
            </li>
            <li onClick={() => setUpdateButton(3)}>
              <span>
                <IoWalletSharp />
              </span>
              <div className="inner-text">
                <span> Wallet</span>
                {/* <span>123</span> */}
              </div>
            </li>
            <li onClick={() => setUpdateButton(5)}>
              <span>
                <MdOutlinePreview />
              </span>
              <div className="inner-text">
                <span> Review</span>
                {/* <span>123</span> */}
              </div>
            </li>
            <li onClick={() => setUpdateButton(4)}>
              <span>
                <TfiGallery />
              </span>
              <div className="inner-text">
                <span> Gallery</span>
                {/* <span>123</span> */}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default DashBoardData_1;
