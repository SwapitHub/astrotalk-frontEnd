"use client";
import { useGlobalContext } from "@/context/HomeContext";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";

const AdminHeader = ({ setToggleSlideMobile }) => {
  const { setUpdateButton } = useGlobalContext();
  const router = useRouter()

  const [toggleSlide, setToggleSlide] = useState(false);
  const [astroDetailData, setAstroDetailData] = useState();

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
  const handleAdminLogOut = () => {
    secureLocalStorage.removeItem("admin_id");
    Cookies.remove("admin_id");
    window.dispatchEvent(new Event("admin_id_updated"));
    router.push("/admin");
  };
  const openProfile = () => {
    setUpdateButton("language");
  };
  return (
    <div className="page-main-header">
      <div className="main-header-right ">
        <div className="main-header-left d-lg-none w-auto">
          <div className="logo-wrapper">
            <Link href="">
              <img
                className="blur-up lazyloaded d-block d-lg-none"
                src=" https://assets.rocksama.com/public/storage/images/1716284040_SAMA.png"
                alt="Logo"
              />
            </Link>
          </div>
        </div>
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
                <img src="/user-profile-icon.jpg" alt="user-profile" />

                <div className="dotted-animation">
                  <span className="animate-circle"></span>
                  <span className="main-circle"></span>
                </div>
              </div>
<ul className="profile-dropdown onhover-show-div">
              <li>
                <Link href="#" onClick={openProfile}>
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
                    className="feather feather-settings"
                  >
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                  </svg>
                  Settings
                </Link>
              </li>
              <li>
              <button onClick={handleAdminLogOut}>
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
                  className="feather feather-log-out"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span>Admin Logout</span>
              </button>
              </li>
              </ul>
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
      </div>
    </div>
  );
};

export default AdminHeader;
