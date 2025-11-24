"use client";
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import AstroNotification from "../component/AstroNotification";
import ProfilePopUp from "../component/ProfilePopUp";
import Image from "next/image";

const DashboardHeader = ({ setToggleSlideMobile }) => {
  const [toggleSlide, setToggleSlide] = useState(false);
  const [astroDetailData, setAstroDetailData] = useState();
  console.log(astroDetailData, "astroDetailData");

  const [astrologerPhone, setAstrologerPhone] = useState();

  useEffect(() => {
    const astrologerPhones = Cookies.get("astrologer-phone");
    setAstrologerPhone(astrologerPhones);
  }, []);

  const toggleFullScreen = () => {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message}`
        );
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const fetchAstroDetailData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}/astrologer-businessProfile-detail/${astrologerPhone}`
        );
        setAstroDetailData(response?.data);
        console.log("astroDetailData", response);
      } catch (error) {
        console.log(error, "user detail api error");
      }
    };

    if (astrologerPhone) {
      fetchAstroDetailData();
    }
  }, [astrologerPhone]);

  const [notificationMobile, setNotificationMobile] = useState();
  const [userMobile, setUserMobile] = useState();

  useEffect(() => {
    if (notificationMobile) {
      document.body.classList.add("notification-opened");
    } else {
      document.body.classList.remove("notification-opened");
    }

    if (userMobile) {
      document.body.classList.add("user-opened");
    } else {
      document.body.classList.remove("user-opened");
    }

    if (toggleSlide) {
      document.body.classList.add("slider-opened");
    } else {
      document.body.classList.remove("slider-opened");
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove("notification-opened");
      document.body.classList.remove("user-opened");
      document.body.classList.remove("slider-opened");
    };
  }, [notificationMobile, userMobile, toggleSlide]);

  return (
    <div className="page-main-header">
      <div className="main-header-right">
        {/* <div className="main-header-left d-lg-none w-auto">
          <div className="logo-wrapper">
            <Link href="">
              <img
                className="blur-up lazyloaded d-block d-lg-none"
                src=" https://assets.rocksama.com/public/storage/images/1716284040_SAMA.png"
                alt="Logo"
              />
            </Link>
          </div>
        </div> */}
        <div className="mobile-sidebar w-auto">
          <div className="media-body text-end switch-sm">
            <label className="switch mobile">
              <Link href="#" onClick={() => setToggleSlideMobile(true)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="feather feather-align-left"
                  id="sidebar-toggle"
                >
                  <line x1="17" y1="10" x2="3" y2="10"></line>
                  <line x1="21" y1="6" x2="3" y2="6"></line>
                  <line x1="21" y1="14" x2="3" y2="14"></line>
                  <line x1="17" y1="18" x2="3" y2="18"></line>
                </svg>
              </Link>
            </label>
            <label className="switch desktop">
              <Link href="#" onClick={() => setToggleSlide((prev) => !prev)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="feather feather-align-left"
                  id="sidebar-toggle"
                >
                  <line x1="17" y1="10" x2="3" y2="10"></line>
                  <line x1="21" y1="6" x2="3" y2="6"></line>
                  <line x1="21" y1="14" x2="3" y2="14"></line>
                  <line x1="17" y1="18" x2="3" y2="18"></line>
                </svg>
              </Link>
            </label>
          </div>
        </div>
        <div className="nav-right col">
          <ul className="nav-menus">
            <li>
              <Link
                className="text-dark"
                href="#!"
                onClick={() => toggleFullScreen()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="feather feather-maximize-2"
                >
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <polyline points="9 21 3 21 3 15"></polyline>
                  <line x1="21" y1="3" x2="14" y2="10"></line>
                  <line x1="3" y1="21" x2="10" y2="14"></line>
                </svg>
              </Link>
            </li>

            {/* <li
              className="onhover-dropdown mobile-notification"
              onClick={() => setNotificationMobile((prev) => !prev)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="feather feather-bell"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span className="badge badge-pill badge-primary pull-right notification-badge">
                4
              </span>
              <span className="dot"></span>
              <HeaderDashNotification />
            </li> */}
            <li
              className="onhover-dropdown mobile-user"
              onClick={() => setUserMobile((prev) => !prev)}
            >
              <div className="media">
                {astroDetailData?.profileImage ? (
                  <Image
                    width={50}
                    height={50}
                    src={
                      process.env.NEXT_PUBLIC_WEBSITE_URL +
                      astroDetailData?.profileImage
                    }
                    alt="user-icon"
                  />
                ) : (
                  <img src="./user-icon-image.png"></img>
                )}

                <div className="dotted-animation">
                  <span className="animate-circle"></span>
                  <span className="main-circle"></span>
                </div>
              </div>
              <ProfilePopUp astroDetailData={astroDetailData} />
            </li>
          </ul>
          <div className="d-lg-none mobile-toggle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="feather feather-more-horizontal"
            >
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="19" cy="12" r="1"></circle>
              <circle cx="5" cy="12" r="1"></circle>
            </svg>
          </div>
        </div>

        {astrologerPhone && (
          <>
            <IoMdNotificationsOutline />
            <AstroNotification
              astrologerPhone={astrologerPhone}
              astroDetailData={astroDetailData}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;
