"use client";
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import OtpData from "../component/OtpData";
import UserOtpLoginData from "../component/UserOtpLoginData";
import { FaUser } from "react-icons/fa";
import SlideToggle from "../component/SlideToggle";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const parts = pathname.split("/");
  const [otpPopUpDisplayAstro, setOtpPopUpDisplayAstro] = useState(false);
  const [otpPopUpDisplay, setOtpPopUpDisplay] = useState(false);
  const [userDetailData, setUserDetailData] = useState();
  const [astrologerPhone, setAstrologerPhone] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [toggleMobile, setToggleMobile] = useState(false);
  const [hideProfilePopup, setHideProfilePopup] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [userIcon, setUserIcon] = useState(false);

setUserIcon
  const [admin_id, setAdmin_id] = useState(() => Cookies.get("admin_id"));

  // console.log(astrologerPhone,astroDetailData);
  const [userMobile, setUserMobile] = useState();

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedId = Cookies.get("admin_id");
      setAdmin_id(updatedId);
    };

    window.addEventListener("admin_id_updated", handleStorageChange);

    // Cleanup
    return () => {
      window.removeEventListener("admin_id_updated", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const astrologerPhone = Cookies.get("astrologer-phone");
    setAstrologerPhone(astrologerPhone);
  }, []);

  // Watch for userMobile updates
  useEffect(() => {
    const storedMobile = Cookies.get("userMobile");
    if (storedMobile) {
      setUserMobile(Math.round(storedMobile));
    }

    const handleStorageChange = () => {
      const updatedMobile = Cookies.get("userMobile");
      if (updatedMobile) {
        setUserMobile(updatedMobile);
        // fetchUserDetail();
      }
    };

    window.addEventListener("userMobileUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("userMobileUpdated", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/user-login-detail/${userMobile}`
        );
        setUserDetailData(response.data.data);
        console.log("API response:", response);
      } catch (err) {
        console.error("user detail api error:", err);
      }
    };

    if (userMobile) {
      fetchUserDetail();
      window.addEventListener("userMobileUpdated", fetchUserDetail);

      return () => {
        window.removeEventListener("userMobileUpdated", fetchUserDetail);
      };
    }
  }, [userMobile]);

  const handleOtpPop = () => {
    if (!astrologerPhone) {
      setOtpPopUpDisplayAstro(true);
    }
  };

  const userLogout = () => {
    window.dispatchEvent(new Event("userMobileUpdatedRemoved"));
    Cookies.remove("userIds");
    Cookies.remove("userMobile");
    Cookies.remove("astrologerId");
    Cookies.remove("AstrologerNotificationStatus");
    setUserMobile(null);
    setTimeout(() => {
      router.push("/chat-with-astrologer");
    }, 200);
  };

  const handelUserLogin = () => {
    setOtpPopUpDisplay(true);
  };

  useEffect(() => {
    if (toggleMobile) {
      document.body.classList.add("menu-opened");
    } else {
      document.body.classList.remove("menu-opened");
    }

    return () => {
      document.body.classList.remove("menu-opened");
    };
  }, [toggleMobile]);

  useEffect(() => {
    if (hideProfilePopup) {
      document.body.classList.add("hide-profile-popup-onload");
    } else {
      document.body.classList.remove("hide-profile-popup-onload");
    }

    const timer = setTimeout(() => {
      document.body.classList.remove("hide-profile-popup-onload");
      setHideProfilePopup(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [hideProfilePopup]);
  console.log(parts, "parts");

  return (
    <>
      {parts[1] == "admin" ||
      parts[1] == "astrologer" ||
      (parts[1] == "chat-with-astrologer" && parts[2] == "astrologer") ? (
        ""
      ) : (
        <header className="header">
          {otpPopUpDisplay == true && (
            <div className={otpPopUpDisplay == true && `outer-send-otp-main`}>
              {otpPopUpDisplay && (
                <UserOtpLoginData setOtpPopUpDisplay={setOtpPopUpDisplay} />
              )}
            </div>
          )}
          <OtpData
            setOtpPopUpDisplayAstro={setOtpPopUpDisplayAstro}
            otpPopUpDisplayAstro={otpPopUpDisplayAstro}
          />
          <div className="container">
            <div className="inner-header-sec ctm-flex-row ctm-align-items-center ctm-justify-content-between">
              <div className="header-left-logo">
                <Link href="/" title="WeddingByte">
                  <img src="/logo.png" alt="WeddingByte" />
                </Link>
              </div>

              <div
                className="mobile-toggle"
                onClick={() => setToggleMobile((prev) => !prev)}
              >
                <span></span>
                <span></span>
                <span></span>
              </div>
              <nav className="navbar">
                <ul>
                  {/* <li>
                    <Link
                      href={`${userMobile ? "/free-chat/start" : "/free-chat"}`}
                      onClick={() => {
                        setIsLoading(true);
                        setTimeout(() => {
                          setIsLoading(false);
                        }, 2000);
                        setToggleMobile(false);
                      }}
                    >
                      Chat Now
                    </Link>
                  </li> */}
                  <li>
                    <Link
                      href={`${"/chat-with-astrologer"}`}
                      onClick={() => {
                        setIsLoading(true);
                        setTimeout(() => {
                          setIsLoading(false);
                        }, 2000);
                        setToggleMobile(false);
                      }}
                    >
                      Chat with Astrologer
                    </Link>
                  </li>
                  <li className="has-submenu">
                    <span
                      onClick={() =>
                        setOpenFaq(
                          openFaq == "Astrologer" ? null : "Astrologer"
                        )
                      }
                    >
                      Astrologer
                    </span>
                    <SlideToggle isOpen={openFaq == "Astrologer"}>
                      <ul className="submenu">
                        <li>
                          <OtpData
                            setOtpPopUpDisplayAstro={setOtpPopUpDisplayAstro}
                            otpPopUpDisplayAstro={otpPopUpDisplayAstro}
                          />
                          <span onClick={handleOtpPop}>Astrologer Login</span>
                        </li>
                        <li>
                          <Link href="/signup"> Astrologer Registration</Link>
                        </li>
                      </ul>
                    </SlideToggle>
                  </li>
                  {/* <li>
                    <Link
                      href="/talk-to-astrologer"
                      onClick={() => {
                        setIsLoading(true);
                        setTimeout(() => {
                          setIsLoading(false);
                        }, 2000);
                        setToggleMobile(false);
                      }}
                    >
                      Talk to Astrologer
                    </Link>
                  </li> */}
                  <li>
                    <Link
                      href="/call"
                      onClick={() => {
                        setIsLoading(true);
                        setTimeout(() => {
                          setIsLoading(false);
                        }, 2000);
                        setToggleMobile(false);
                      }}
                    >
                      Add Call
                    </Link>
                  </li>
                  {/* <li>
                    <span onClick={handleOtpPop}>
                      Login Astrologer Dashboard
                    </span>
                  </li> */}
                  <li>
                    <Link
                      href={`${"/shop"}`}
                      onClick={() => {
                        setIsLoading(true);
                        setTimeout(() => {
                          setIsLoading(false);
                        }, 2000);
                        setToggleMobile(false);
                      }}
                    >
                      Shop
                    </Link>
                  </li>

                  {/* <li>
                  <Link href="/admin">Admin</Link>
                </li> */}
                </ul>
              </nav>

              {userMobile ? (
                <div className="header-right-profil-icon">
                  <div className="user-dashboard-profile ctm-text-end">
                    <div className="user-dashboard-profile-main-pro">
                      <Link href="#" title="dashboard">
                        <FaUser />
                      </Link>
                      <div className="user-dashboard-profile-menu">
                        <div className="user-inner-dashbord-pic">
                          <Link href="#" title="Profile">
                            <FaUser />
                          </Link>
                          <div className="user-inner-dashbord-content">
                            <h5>{userDetailData?.name || ""}</h5>
                            <Link href="#" title="Number">
                              {userDetailData?.phone}
                            </Link>
                          </div>
                        </div>
                        <div className="user-dashboard-profile-drop-down-menu">
                          <ul>
                            <>
                              <li>
                                <Link
                                  href="/notification"
                                  title="notification"
                                  onClick={() => setHideProfilePopup(true)}
                                >
                                  Notification
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/my-wallet"
                                  title="Wallet Transactions"
                                  onClick={() => setHideProfilePopup(true)}
                                >
                                  Wallet Transactions{" "}
                                  <span className="amount-ctm-content">
                                    &#8377; {userDetailData?.totalAmount}
                                  </span>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/order-history/chat"
                                  title="order history"
                                  onClick={() => setHideProfilePopup(true)}
                                >
                                  Order History
                                </Link>
                              </li>
                            </>

                            <li>
                              <span className="logout" onClick={userLogout}>
                                Logout
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="header-user">
                    <div className="header-user-icon"onClick={()=>{setUserIcon(!userIcon)}}>
                      <FaUser />
                    </div>
                    <div className={`header-user-drop-down ${userIcon ? "open":""}`}>
                      <ul>
                        <li>
                          <Link href="/free-chat/start">
                            User Registration{" "}
                          </Link>
                        </li>
                        <li>
                          <span onClick={handelUserLogin}>User Login</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          {/* {isLoading && (
            <div className="loader">
              <Loader />
            </div>
          )} */}
        </header>
      )}
    </>
  );
};

export default Header;
