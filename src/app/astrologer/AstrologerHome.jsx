"use client";
import { useGlobalContext } from "@/context/HomeContext";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CiWallet } from "react-icons/ci";
import { FaHeadSideCough } from "react-icons/fa";
import { GrServices } from "react-icons/gr";
import { ImProfile } from "react-icons/im";
import { IoMdLogOut } from "react-icons/io";
import { IoStar, IoStarHalf, IoStarOutline } from "react-icons/io5";
import { MdOutlineDashboard, MdOutlinePreview } from "react-icons/md";
import { TfiGallery } from "react-icons/tfi";
import DashboardHeader from "../header/DashboardHeader";
import AstrologerGallery from "./AstrologerGallery";
import AstrologerOrderPujaWallet from "./AstrologerOrderPujaWallet";
import AstrologerProfile from "./AstrologerProfile";
import AstrologerReview from "./AstrologerReview";
import AstrologerWallet from "./AstrologerWallet";
import DashBoardData_1 from "./DashBoardData_1";
import SpiritualServices from "./SpiritualServices";
import { AstroDocument } from "./AstroDocument";
import PaymentWithdrawal from "./PaymentWithdrawal";

const AstrologerHome = () => {
  const router = useRouter();
  const { updateButton, setUpdateButton } = useGlobalContext();
  const [astrologerPhone, setAstrologerPhone] = useState([]);
  // const [updateButton, setUpdateButton] = useState(updateButtonGlobal);
  const [successMessageProfile, setSuccessMessageProfile] = useState();
  const [astrologerData, setAstrologerData] = useState("");
  const [toggleSlideMobile, setToggleSlideMobile] = useState(false);
  const [registrationDetail, setRegistrationDetail] = useState();
  console.log(astrologerData, "astrologerData");

  useEffect(() => {
    if (!astrologerPhone) {
      router.push("/");
    }
  }, [astrologerPhone]);

  useEffect(() => {
    const astrologerPhones = Cookies.get("astrologer-phone");

    if (astrologerPhone == undefined) return;

    setAstrologerPhone(astrologerPhones);
  }, []);

  useEffect(() => {
    if (!astrologerData?.completeProfile == true) {
      setUpdateButton(2);
    } else {
      setUpdateButton(1);
    }
  }, [astrologerData]);

  useEffect(() => {
    if (!astrologerPhone) return;

    axios
      .get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/astrologer-businessProfile-detail/${astrologerPhone}`
      )
      .then((response) => {
        setAstrologerData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [astrologerPhone]);

  // useEffect(() => {
  //   if (updateButton !== 2 && successMessageProfile.message !== "success") {
  //     toast.warning("please complete the profile", {
  //       position: "top-right",
  //     });
  //   }
  // }, [updateButton]);
  const handleUpdateStatus = async (e) => {
    const mobileNumber = e.target.name;
    const isChecked = e.target.checked;

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/update-business-profile/${mobileNumber}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            freeChatStatus: isChecked,
          }),
        }
      );

      console.log("freeChatStatus updated to", isChecked);
    } catch (error) {
      console.error("Failed to update freeChatStatus:", error);
    }
  };

  const astroLogerLogout = async () => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/update-astro-status-by-mobile/${astrologerPhone}`,
        {
          profileStatus: false,
        }
      );
      console.log(response);

      if (response.data.message == "Success") {
        Cookies.remove("astrologer-phone");
        router.push("/");
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

  useEffect(() => {
    if (registrationDetail?.blockUnblockAstro == true) {
      astroLogerLogout();
    }
  }, [registrationDetail, astroLogerLogout]);

  useEffect(() => {
    const className = "slider-opened";

    if (toggleSlideMobile) {
      document.body.classList.add(className);
    } else {
      document.body.classList.remove(className);
    }
  }, [toggleSlideMobile]);

  const renderStars = (averageRating) => {
    const stars = [];
    const fullStars = Math.floor(averageRating);
    const hasHalfStar =
      averageRating - fullStars >= 0.25 && averageRating - fullStars < 0.75;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
      stars.push(<IoStar key={`full-${i}`} />);
    }

    if (hasHalfStar) {
      stars.push(<IoStarHalf key="half" />);
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(<IoStarOutline key={`empty-${i}`} />);
    }

    return stars;
  };

  return (
    <main className="main-content">
      <DashboardHeader setToggleSlideMobile={setToggleSlideMobile} />
      <div class="dashboard-main-outer">
        <div className="container">
          <div className="dashboard-inner-main">
            <div className="dashboard-inner">
              <div className="dashboard-left-dashboard">
                <div
                  className="mobile-close-sidebar"
                  onClick={() => setToggleSlideMobile(false)}
                >
                  <span></span>
                  <span></span>
                </div>
                <div className="left-sidebar-logo">
                  <a href="#" title="">
                    <img src="/logo.png" alt="Logo" />
                  </a>
                </div>
                <div className="dashboard-list">
                  <ul>
                    <li className={updateButton === 1 ? "active" : ""}>
                      <a
                        href="#"
                        title="menu"
                        onClick={(e) => {
                          e.preventDefault();
                          setUpdateButton(1);
                        }}
                      >
                        <MdOutlineDashboard />
                        <span className="list-text">Dashboard</span>
                      </a>
                    </li>
                    <li className={updateButton === 2 ? "active" : ""}>
                      <a
                        href="#"
                        title="menu"
                        onClick={(e) => {
                          e.preventDefault();
                          setUpdateButton(2);
                        }}
                      >
                        <ImProfile />
                        <span className="list-text">Manage Profile</span>
                      </a>
                    </li>
                    <li className={updateButton === 3 ? "active" : ""}>
                      <a
                        href="#"
                        title="menu"
                        onClick={(e) => {
                          e.preventDefault();
                          setUpdateButton(3);
                        }}
                      >
                        <CiWallet />
                        <span className="list-text">Wallet Chatting</span>
                      </a>
                    </li>

                    <li
                      className={updateButton === "WalletPuja" ? "active" : ""}
                    >
                      <a
                        href="#"
                        title="menu"
                        onClick={(e) => {
                          e.preventDefault();
                          setUpdateButton("WalletPuja");
                        }}
                      >
                        <CiWallet />
                        <span className="list-text">Wallet Puja Order</span>
                      </a>
                    </li>
                    <li
                      className={
                        updateButton === "PaymentWithdrawal" ? "active" : ""
                      }
                    >
                      <a
                        href="#"
                        title="menu"
                        onClick={(e) => {
                          e.preventDefault();
                          setUpdateButton("PaymentWithdrawal");
                        }}
                      >
                        <CiWallet />
                        <span className="list-text">Payment Withdrawal</span>
                      </a>
                    </li>
                    <li
                      className={
                        updateButton === "spiritual-services" ? "active" : ""
                      }
                    >
                      <a
                        href="#"
                        title="menu"
                        onClick={(e) => {
                          e.preventDefault();
                          setUpdateButton("spiritual-services");
                        }}
                      >
                        <GrServices />
                        <span className="list-text">Spiritual Services</span>
                      </a>
                    </li>
                    <li className={updateButton === 4 ? "active" : ""}>
                      <a
                        href="#"
                        title="menu"
                        onClick={(e) => {
                          e.preventDefault();
                          setUpdateButton(4);
                        }}
                      >
                        <TfiGallery />
                        <span className="list-text">Gallery</span>
                      </a>
                    </li>
                    <li className={updateButton === 5 ? "active" : ""}>
                      <a
                        href="#"
                        title="menu"
                        onClick={(e) => {
                          e.preventDefault();
                          setUpdateButton(5);
                        }}
                      >
                        <MdOutlinePreview />
                        <span className="list-text">My Review</span>
                      </a>
                    </li>
                    <li className={updateButton === 6 ? "active" : ""}>
                      <a
                        href="#"
                        title="menu"
                        onClick={(e) => {
                          e.preventDefault();
                          setUpdateButton(6);
                        }}
                      >
                        <FaHeadSideCough />
                        <span className="list-text">Id Proof</span>
                      </a>
                    </li>

                    {astrologerData?.completeProfile == true && (
                      <li>
                        <span>
                          <input
                            type="checkbox"
                            name={astrologerPhone}
                            onClick={handleUpdateStatus}
                            defaultChecked={astrologerData.freeChatStatus}
                          />
                          <label>Are you Available for free chat </label>
                        </span>
                      </li>
                    )}

                    <li>
                      <span onClick={astroLogerLogout}>
                        <IoMdLogOut />
                        <span className="list-text">Log Out Astrologer</span>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="dashboard-right-content">
                {updateButton == 1 && (
                  <DashBoardData_1
                    astrologerData={astrologerData}
                    setUpdateButton={setUpdateButton}
                  />
                )}

                {updateButton == 2 && (
                  <AstrologerProfile
                    successMessageProfile={successMessageProfile}
                    setSuccessMessageProfile={setSuccessMessageProfile}
                    astrologerData={astrologerData}
                    registrationDetail={registrationDetail}
                    setRegistrationDetail={setRegistrationDetail}
                  />
                )}
                {updateButton == 3 && <AstrologerWallet />}
                {updateButton == "PaymentWithdrawal" && <PaymentWithdrawal />}
                {updateButton == "spiritual-services" && <SpiritualServices />}
                {updateButton == 4 && (
                  <AstrologerGallery astrologerData={astrologerData} />
                )}
                {updateButton == 5 && (
                  <AstrologerReview
                    astrologerData={astrologerData}
                    renderStars={renderStars}
                  />
                )}

                {updateButton == 6 && (
                  <AstroDocument registrationDetail={registrationDetail} />
                )}

                {updateButton == "WalletPuja" && (
                  <AstrologerOrderPujaWallet astrologerData={astrologerData} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AstrologerHome;
