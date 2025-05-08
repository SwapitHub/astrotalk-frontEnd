"use client";
import Link from "next/link";
import OtpData from "../component/OtpData";
import { useEffect, useState } from "react";
import AstroNotification from "../component/AstroNotification";
import { IoMdNotificationsOutline } from "react-icons/io";
import axios from "axios";
import { useRouter } from "next/navigation";
import secureLocalStorage from "react-secure-storage";
import UserOtpLoginData from "../component/UserOtpLoginData";

const Header = () => {
  const router = useRouter();
  const [otpPopUpDisplayAstro, setOtpPopUpDisplayAstro] = useState(false);
  const [otpPopUpDisplay, setOtpPopUpDisplay] = useState(false);
  const [userDetailData, setUserDetailData] = useState();
  const [astroDetailData, setAstroDetailData] = useState();
  const [astrologerPhone, setAstrologerPhone] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [admin_id, setAdmin_id] = useState(() =>
    secureLocalStorage.getItem("admin_id")
  );

  // console.log(astrologerPhone,astroDetailData);
  const [userMobile, setUserMobile] = useState();
  console.log(admin_id, userMobile);

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedId = secureLocalStorage.getItem("admin_id");
      setAdmin_id(updatedId);
    };

    window.addEventListener("admin_id_updated", handleStorageChange);

    // Cleanup
    return () => {
      window.removeEventListener("admin_id_updated", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const astrologerPhone = secureLocalStorage.getItem("astrologer-phone");
    setAstrologerPhone(astrologerPhone);
  }, []);

  // Watch for userMobile updates
  useEffect(() => {
    const storedMobile = secureLocalStorage.getItem("userMobile");
    if (storedMobile) {
      setUserMobile(Math.round(storedMobile));
    }

    const handleStorageChange = () => {
      const updatedMobile = secureLocalStorage.getItem("userMobile");
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
    const fetchAstroDetailData = async () => {
      try {
        const response = await axios.get(
          `${
            process.env.NEXT_PUBLIC_WEBSITE_URL
          }/astrologer-businessProfile/${Math.round(astrologerPhone)}`
        );
        setAstroDetailData(response?.data);
      } catch (error) {
        console.log(error, "user detail api error");
      }
    };

    if (astrologerPhone) {
      fetchAstroDetailData();
    }
  }, [astrologerPhone]);

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/user-login-detail/${userMobile}`
        );
        setUserDetailData(response.data);
        console.log("API response:", response);
      } catch (err) {
        console.error("user detail api error:", err);
      }
    };

    if (userMobile) {
      fetchUserDetail();
    }
  }, [userMobile]);

  const handleOtpPop = () => {
    if (!astrologerPhone) {
      setOtpPopUpDisplayAstro(true);
    }
  };

  const userLogout = () => {
    window.dispatchEvent(new Event(""));
    secureLocalStorage.removeItem("userIds");
    secureLocalStorage.removeItem("userMobile");
    secureLocalStorage.removeItem("astrologerId");
    secureLocalStorage.removeItem("AstrologerNotificationStatus");
    setUserMobile(null);
  };

  const astroLogerLogout = async () => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/update-astro-status-by-mobile/${astrologerPhone}`,
        {
          profileStatus: false,
        }
      );
      if (response.data.message == "Success") {
        secureLocalStorage.removeItem("astrologer-phone");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
      console.log("Astrologer status updated:", response.data);
      // update order history
      const updateList = await axios.put(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/userId-to-astrologer-astro-list-update`,
        {
          mobileNumber: astrologerPhone,
          profileStatus: false,
        }
      );
      console.log("update order history", updateList);
    } catch (error) {
      console.error(
        "Failed to update astrologer status:",
        error.response?.data?.error || error.message
      );
    }
  };

  const handelUserLogin = () => {
    setOtpPopUpDisplay(true);
  };
  const handleAdminLogOut = () => {
    secureLocalStorage.removeItem("admin_id");

    // Notify other parts of the app
    window.dispatchEvent(new Event("admin_id_updated"));

    // Redirect
    router.push("/admin");
  };

  return (
    <header className="header">
      
      {otpPopUpDisplay == true && (
        <div className={otpPopUpDisplay == true && `outer-send-otp-main`}>
          {otpPopUpDisplay && (
            <UserOtpLoginData setOtpPopUpDisplay={setOtpPopUpDisplay} />
          )}
        </div>
      )}
      <div className="container">
        <div className="inner-header-sec ctm-flex-row ctm-align-items-center ctm-justify-content-between">
          <div className="header-left-logo">
            <Link href="/" title="WeddingByte">
              <img src="/astrotalk-logo.webp" alt="WeddingByte" />
            </Link>
          </div>
          {!(admin_id || astrologerPhone) && (
            <nav className="navbar">
              <ul>
                <li>
                  <Link
                    href={`${
                      userMobile ? "/free-chat/start" : "/free-chat"
                    }`}
                    onClick={() => {
                      setIsLoading(true);
                      setTimeout(() => {
                        setIsLoading(false);
                      }, 3000);
                    }}
                  >
                    Chat Now
                  </Link>
                </li>
                <li>
                  <Link
                    href={`${"/chat-with-astrologer"}`}
                    onClick={() => {
                      setIsLoading(true);
                      setTimeout(() => {
                        setIsLoading(false);
                      }, 3000);
                    }}
                  >
                    Chat with Astrologer
                  </Link>
                </li>
                <li>
                  <div>
                    <OtpData
                      setOtpPopUpDisplayAstro={setOtpPopUpDisplayAstro}
                      otpPopUpDisplayAstro={otpPopUpDisplayAstro}
                    />
                    <Link
                      href={`${
                        astrologerPhone ? "/astrologer-dashboard" : "/"
                      }`}
                      onClick={handleOtpPop}
                    >
                      Astrologer Dashboard
                    </Link>
                  </div>
                </li>
                <li>
                  <Link
                    href="/signup"
                    onClick={() => {
                      setIsLoading(true);
                      setTimeout(() => {
                        setIsLoading(false);
                      }, 3000);
                    }}
                  >
                    Astrologer Registration
                  </Link>
                </li>
                {/* <li>
                  <Link href="/admin">Admin</Link>
                </li> */}
              </ul>
            </nav>
          )}
          {astrologerPhone && (
            <>
              <IoMdNotificationsOutline />
              <AstroNotification astrologerPhone={astrologerPhone} />
            </>
          )}

          {admin_id ? (
            <button onClick={handleAdminLogOut}>Log out admin</button>
          ) : astrologerPhone || userMobile ? (
            <div className="header-right-profil-icon">
              <div className="user-dashboard-profile ctm-text-end">
                <div className="user-dashboard-profile-main-pro">
                  <Link href="#" title="dashboard">
                    <img
                      src={
                        astroDetailData
                          ? `https://aws.astrotalk.com/consultant_pic/p-50896.jpg`
                          : `/user-profile-icon.jpg`
                      }
                      alt="user-profile"
                    />
                  </Link>
                  <div className="user-dashboard-profile-menu">
                    <div className="user-inner-dashbord-pic">
                      <Link href="#" title="Profile">
                        <img
                          src={
                            astroDetailData
                              ? `https://aws.astrotalk.com/consultant_pic/p-50896.jpg`
                              : `/user-profile-icon.jpg`
                          }
                          alt="user-profile"
                        />
                      </Link>
                      <div className="user-inner-dashbord-content">
                        <h5>
                          {astrologerPhone
                            ? `${astroDetailData?.name}`
                            : `${userDetailData?.name}`}
                        </h5>
                        <Link href="#" title="Number">
                          {astrologerPhone
                            ? `${astroDetailData?.mobileNumber}`
                            : `${userDetailData?.phone}`}
                        </Link>
                      </div>
                    </div>
                    <div className="user-dashboard-profile-drop-down-menu">
                      <ul>
                        {!astrologerPhone && (
                          <>
                            <li>
                              <Link href="/notification" title="notification">
                                Notification
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/my-wallet"
                                title="Wallet Transactions"
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
                              >
                                Order History
                              </Link>
                            </li>
                          </>
                        )}
                        <li>
                          <Link
                            href={`${astrologerPhone ? "/" : "/"}`}
                            onClick={
                              astrologerPhone ? astroLogerLogout : userLogout
                            }
                          >
                            Logout
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <button onClick={handelUserLogin}>User Login</button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
