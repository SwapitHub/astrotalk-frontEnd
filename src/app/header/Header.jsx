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

// console.log(astrologerPhone,astroDetailData);
  const [userMobile, setUserMobile] = useState();
  console.log(userDetailData,userMobile);

  useEffect(()=>{
    const astrologerPhone = secureLocalStorage.getItem("astrologer-phone");
  setAstrologerPhone(astrologerPhone)
},[])

  useEffect(() => {
    const fetchUserMobile = () => {
      const storedUserMob = secureLocalStorage.getItem("userMobile");
      setUserMobile(storedUserMob);
    };

    fetchUserMobile();

    // Listen for storage changes
    window.addEventListener("storageUserMobile", fetchUserMobile);

    return () => {
      window.removeEventListener("storageUserMobile", fetchUserMobile);
    };
  }, []);

useEffect(() => {
  const fetchAstroDetailData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/astrologer-businessProfile/${Math.round(astrologerPhone)}`
      );
      setAstroDetailData(response?.data);
    } catch (error) {
      console.log(error, "user detail api error");
    }
  };

  if(astrologerPhone){

    fetchAstroDetailData();
  }
}, [astrologerPhone]);

useEffect(() => {
  const fetchUserDetailData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/user-login-detail/${Math.round(userMobile)}`
      );
      setUserDetailData(response?.data);
    } catch (error) {
      console.log(error, "user detail api error");
    }
  };
if(userMobile){

  fetchUserDetailData();
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
  return (
    <header className="wedding-header">
      <div className={otpPopUpDisplay == true && `outer-send-otp-main`}>
        {otpPopUpDisplay && (
          <UserOtpLoginData setOtpPopUpDisplay={setOtpPopUpDisplay} />
        )}
      </div>
      <div className="container">
        <div className="inner-header-sec ctm-flex-row ctm-align-items-center ctm-justify-content-between">
          <div className="header-left-logo">
            <Link
              href="/"
              title="WeddingByte"
            >
              <img src="/astrotalk-logo.webp" alt="WeddingByte" />
            </Link>
          </div>
           {!astrologerPhone && (
            <nav className="navbar">
              <ul>
                <li>
                  <Link
                    href={`${userMobile ? "/chat-with-astrologer" : "/free-chat"}`}
                  >
                    Chat Now
                  </Link>
                </li>
                <li>
                  <Link
                    href={`${!userMobile ? "/free-chat" : "/chat-with-astrologer"}`}
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
                  <Link href="/signup">Astrologer Registration</Link>
                </li>
                <li>
                  <Link href="/admin">Admin</Link>
                </li>
              </ul>
            </nav>
          )} 
          {astrologerPhone && (
            <>
               <IoMdNotificationsOutline /> 
              <AstroNotification astrologerPhone={astrologerPhone}/>
            </>
          )}

           {astrologerPhone || userMobile ? (
            <div className="header-right-profil-icon">
              <div className="user-dashboard-profile ctm-text-end">
                <div className="user-dashboard-profile-main-pro">
                  <Link href="#" title="dashboard">
                  <img src={astroDetailData ? `/images/${astroDetailData?.profileImage}` :`/user-profile-icon.jpg`} alt="user-profile" />
                  </Link>
                  <div className="user-dashboard-profile-menu">
                    <div className="user-inner-dashbord-pic">
                      <Link href="#" title="Profile">
                        <img src={astroDetailData ? `/images/${astroDetailData?.profileImage}` :`/user-profile-icon.jpg`} alt="user-profile" />
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
                        <li>
                          <Link href="/notification" title="notification">
                            Notification
                          </Link>
                        </li>
                        <li>
                          <Link href="/my-wallet" title="Wallet Transactions">
                            Wallet Transactions{" "}
                            <span className="amount-ctm-content">
                              &#8377; 0
                            </span>
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/order-history/report"
                            title="order history"
                          >
                            Order History
                          </Link>
                        </li>
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
