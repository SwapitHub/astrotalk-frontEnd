"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import io from "socket.io-client";
import UserRecharge from "../component/UserRechargePopUp";
import {
  IoHome,
  IoStar,
  IoStarHalf,
  IoStarOutline,
  IoCallSharp,
} from "react-icons/io5";
import { SiMessenger } from "react-icons/si";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
import UserOtpLoginData from "../component/UserOtpLoginData";
import RequestPopUp from "../component/RequestPopUp";
import { useRouter } from "next/navigation";
import AstrologerReview from "../astrologer-dashboard/AstrologerReview";

const socket = io(`${process.env.NEXT_PUBLIC_WEBSITE_URL}`, {
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  transports: ["websocket"], // Try WebSocket first
  autoConnect: true,
  forceNew: true,
});
export const AstrologerDetail = ({ astrologerData }) => {
  const router = useRouter();
  const [showRecharge, setShowRecharge] = useState(false);
  const [astroMobileNum, setAstroMobileNum] = useState();
  const [astrologerId, setAstrologerId] = useState();

  const [userData, setUserData] = useState();
  const [otpPopUpDisplay, setOtpPopUpDisplay] = useState(false);
  const [isLoadingRequest, setIsLoadingRequest] = useState();
  const [astrologerNotificationStatus, setAstrologerNotificationStatus] =
    useState(null);

  const [userIds, setUserIds] = useState(null);
  const [userMobile, setUserMobile] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = localStorage.getItem("userIds");
      const mobile = localStorage.getItem("userMobile");
      const loadingReq = localStorage.getItem("IsLoadingRequestStore");

      console.log(id, mobile, "userId-userMobile (safe read)");
      setUserIds(id);
      setUserMobile(mobile);
      setIsLoadingRequest(loadingReq);
    }
  }, []);

  useEffect(() => {
    if (userMobile) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/user-login-detail/${userMobile}`
        )
        .then((res) => {
          setUserData(res.data.data);
        })
        .catch((err) => {
          console.log(err, "user login api error");
        });
    }
  }, [userMobile]);

  const userAmount = userData?.totalAmount;

  const onChangeId = async (
    astrologerId,
    mobileNumber,
    // profileImage,
    astroName,
    astroCharge,
    astroExperience
  ) => {
    if (!userIds) {
      console.error("userIds is undefined!");
      return;
    }
    if (userAmount >= astroCharge * 2) {
      try {
        // Navigate to the chat page
        // await router.push(`/chat-with-astrologer/user/${userIds}`);

        // This code will run after the navigation is complete
        localStorage.setItem("IsLoadingRequestStore", true);
        setIsLoadingRequest(true);

        localStorage.setItem("astrologerId", astrologerId);

        const messageId = {
          userIdToAst: userIds,
          astrologerIdToAst: astrologerId,
          mobileNumber: mobileNumber,
          // profileImage: profileImage,
          astroName: astroName,
          astroCharges: astroCharge,
          astroExperience: astroExperience,
          chatId: "",
          chatType: "free",
          chatDuration: "0 min",
          chatDeduction: "0",
          DeleteOrderHistoryStatus: true,
          chatStatus: true,
          userName: userData?.name,
          userDateOfBirth: userData?.dateOfBirth,
          userPlaceOfBorn: userData?.placeOfBorn,
          userBornTime: userData?.reUseDateOfBirth,
        };

        socket.emit("userId-to-astrologer", messageId);
        socket.emit("astrologer-chat-requestPaidChat", { requestStatus: 0 });
      } catch (error) {
        console.error("Navigation failed:", error);
      }
    } else {
      setShowRecharge(true);
      setAstroMobileNum(mobileNumber);
    }
  };

  useEffect(() => {
    // Listen for success event from the server
    socket.on("userId-to-astrologer-success", (data) => {
      // console.log("userId and astrologerId saved successfully:", data);
    });

    // Listen for error event from the server
    socket.on("userId-to-astrologer-error", (error) => {
      console.error("Error saving userId and astrologerId:", error);
      // You can update the UI or show an error message here
    });

    return () => {
      // Clean up event listeners
      socket.off("userId-to-astrologer-success");
      socket.off("userId-to-astrologer-error");
    };
  }, []);
  useEffect(() => {
    if (showRecharge) {
      document.body.classList.add("user-recharge");
    } else {
      document.body.classList.remove("user-recharge");
    }
  }, [showRecharge]);

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

  const ratings = {
    5: astrologerData?.averageRating_5,
    4: astrologerData?.averageRating_4,
    3: astrologerData?.averageRating_3,
    2: astrologerData?.averageRating_2,
    1: astrologerData?.averageRating_1,
  };

  const colorClasses = {
    5: "bg_green",
    4: "bg_blue",
    3: "bg_light_green",
    2: "bg_brown",
    1: "bg_voilet",
  };
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 700,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 2000,
  };
  const handelUserLogin = () => {
    setOtpPopUpDisplay(true);
  };

  useEffect(() => {
    if (isLoadingRequest) {
      if (astrologerId) {
        router.push(`/chat-with-astrologer/user/${userIds}`);
        localStorage.setItem("astrologerId", astrologerId);

        localStorage.setItem("IsLoadingRequestStore", false);
        setIsLoadingRequest(false);
      } else {
        setIsLoadingRequest(true);
        localStorage.setItem("IsLoadingRequestStore", true);

        console.log("No astrologer found. Timer fallback logic can go here.");

        // return () => clearTimeout(timer);
      }
    }
  }, [astrologerId, isLoadingRequest]);

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (data) => {
      console.log("Received data:", data.astrologerData);
      const id = data.astrologerData?._id;
      setAstrologerId(id);
      const newStatus = data.astrologerData.chatStatus;
      console.log(newStatus);

      setAstrologerNotificationStatus((prevStatus) => {
        if (prevStatus !== newStatus) {
          localStorage.setItem("AstrologerNotificationStatus", newStatus);
          return newStatus;
        }
        return prevStatus;
      });
    };

    socket.on("connect", () => console.log("Connected to socket.io server"));
    socket.on(
      "astrologer-data-received-new-notification",
      handleNewNotification
    );

    return () => {
      socket.off(
        "astrologer-data-received-new-notification",
        handleNewNotification
      );
    };
  }, [socket]);

  return (
    <main className="main-content">
      {isLoadingRequest && (
        <RequestPopUp setIsLoadingRequest={setIsLoadingRequest} />
      )}

      {showRecharge && (
        <UserRecharge
          setShowRecharge={setShowRecharge}
          astroMobileNum={astroMobileNum}
        />
      )}
      {otpPopUpDisplay && (
        <div className={otpPopUpDisplay == true && `outer-send-otp-main`}>
          <UserOtpLoginData setOtpPopUpDisplay={setOtpPopUpDisplay} />
        </div>
      )}

      <section className="astrologer_profile_Section">
        <div className="container">
          <div className="astrologer_profile_Section-inner">
            <div className="breadcrumb">
              <ul>
                <li>
                  <Link href="/chat-with-astrologer">
                    <span className="icon">
                      <IoHome />
                    </span>
                  </Link>
                  <span className="text">{astrologerData.name}'s Profile</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* <!---- Profile image with contact and slider --> */}
      <section className="profile_with_contact_slider">
        <div className="container">
          <div className="profile_with_contact_slider-inner">
            <div className="profile_with_contact">
              <div className="image">
                <div className="img">
                  <img src="https://aws.astrotalk.com/consultant_pic/p-106783.jpg" />
                </div>
                <button type="button" className="follow-button">
                  Follow
                </button>
              </div>
              <div className="content">
                <div className="astrologer_name">
                  <h1>{astrologerData.name}</h1>
                  <div className="icon">
                    {/* <img src="./Images/check.webp" /> */}
                  </div>
                </div>
                <div className="about_astrologer">
                  <p className="skills">
                    {astrologerData?.professions?.map((item) => {
                      return (
                        <>
                          <span className="des">{item}</span>
                        </>
                      );
                    })}
                  </p>
                  <p className="lang-outer">
                    {astrologerData?.languages?.map((item) => {
                      return (
                        <>
                          <span className="lang">{item}</span>
                        </>
                      );
                    })}
                  </p>
                  <p className="exp">Exp: {astrologerData.experience} Years</p>
                  <p className="charges">
                    <b> ₹ {astrologerData.charges}</b>
                    <span>/min</span>
                  </p>
                </div>

                <div className="details_of_conversation">
                  <div className="chat_details">
                    <div className="icon_details">
                      <SiMessenger />
                    </div>
                    <b>
                      {astrologerData?.astroTotalChatTime >= 1000
                        ? `${(
                            astrologerData?.astroTotalChatTime / 1000
                          ).toFixed(1)}k`
                        : astrologerData?.astroTotalChatTime || 0}
                    </b>
                    <span> mins</span>
                  </div>

                  <div className="call_details">
                    <div className="chat_details">
                      <div className="icon_details">
                        <IoCallSharp />
                      </div>
                      <b>
                        {astrologerData?.astroTotalChatTime >= 1000
                          ? `${(
                              astrologerData?.astroTotalChatTime / 1000
                            ).toFixed(1)}k`
                          : astrologerData?.astroTotalChatTime || 0}
                      </b>
                      <span> mins</span>
                    </div>
                  </div>
                </div>

                <div className="btns_chat_call">
                  <div className="start_btn">
                    {astrologerData.chatStatus == false ? (
                      <div className="astrologer-call-button-ctm-detail">
                        {userAmount >= astrologerData.charges * 2 ? (
                          <Link
                            className="btns_astrolgers_contact"
                            href="#"
                            onClick={() => {
                              onChangeId(
                                astrologerData._id,
                                astrologerData.mobileNumber,
                                // item.profileImage,
                                astrologerData.name,
                                astrologerData.charges,
                                astrologerData.experience
                              );
                            }}
                          >
                            <span className="icon">
                              <SiMessenger />
                            </span>
                            Chat{" "}
                          </Link>
                        ) : !userMobile || !userIds ? (
                          <Link href="#" onClick={handelUserLogin}>
                            chat
                          </Link>
                        ) : (
                          <Link
                            className="btns_astrolgers_contact"
                            href="#"
                            onClick={() =>
                              onChangeId(
                                astrologerData._id,
                                astrologerData.mobileNumber,
                                // item.profileImage,
                                astrologerData.name,
                                astrologerData.charges,
                                astrologerData.experience
                              )
                            }
                          >
                            <span className="icon">
                              <SiMessenger />
                            </span>
                            chat
                          </Link>
                        )}
                      </div>
                    ) : (
                      <div className="astrologer-call-button-ctm chatStatus-false">
                        <Link
                          href={
                            userData?.chatStatus
                              ? `/chat-with-astrologer/user/${userIds}`
                              : "#"
                          }
                          // onClick={() =>
                          //   onChangeId(item._id, item.mobileNumber)
                          // }
                        >
                          Chat
                        </Link>
                        <span>waiting 5 minutes</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* <!--- slider --> */}
            <div className="slider-outer">
              <Slider
                {...sliderSettings}
                responsive={[
                  {
                    breakpoint: 1198,
                    settings: {
                      slidesToShow: 3,
                      slidesToScroll: 4,
                      infinite: true,
                    },
                  },
                  {
                    breakpoint: 800,
                    settings: {
                      slidesToShow: 3,
                      slidesToScroll: 3,
                      infinite: true,
                    },
                  },
                  {
                    breakpoint: 639,
                    settings: {
                      slidesToShow: 3,
                      slidesToScroll: 3,
                      infinite: true,
                    },
                  },
                  {
                    breakpoint: 375,
                    settings: {
                      slidesToShow: 2,
                      slidesToScroll: 2,
                      infinite: true,
                    },
                  },
                ]}
              >
                <div className="astro-img">
                  <img
                    src="https://d1gcna0o0ldu5v.cloudfront.net/fit-in/262x262/images/6f17062e-24d1-4772-afcd-4de411d68d49.jpeg"
                    alt=""
                  />
                </div>
                <div className="astro-img">
                  <img
                    src="https://d1gcna0o0ldu5v.cloudfront.net/fit-in/262x262/images/6f17062e-24d1-4772-afcd-4de411d68d49.jpeg"
                    alt=""
                  />
                </div>
                <div className="astro-img">
                  <img
                    src="https://d1gcna0o0ldu5v.cloudfront.net/fit-in/262x262/images/6f17062e-24d1-4772-afcd-4de411d68d49.jpeg"
                    alt=""
                  />
                </div>
                <div className="astro-img">
                  <img
                    src="https://d1gcna0o0ldu5v.cloudfront.net/fit-in/262x262/images/6f17062e-24d1-4772-afcd-4de411d68d49.jpeg"
                    alt=""
                  />
                </div>
              </Slider>
              {/* <!--- about section --> */}
            </div>
            <div className="about_us">
              <h2>About me</h2>
              <p>{astrologerData.Description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* <!--- rating review --> */}

      <section className="rating_review">
        <div className="container">
          <div className="rating_review-inner">
            <div className="row">
              <div className="left_col">
                <div className="rating_col">
                  <h2>Rating & Reviews</h2>

                  <div className="review">
                    <div className="rating_star">
                      <div className="ratting_number">
                        {astrologerData?.averageRating}
                      </div>
                      <ul className="stars">
                        <li>{renderStars(astrologerData?.averageRating)}</li>
                      </ul>
                      <div className="total_view">
                        <i className="fa-solid fa-user"></i>
                        <span>{astrologerData?.totalOrders} total </span>
                      </div>
                    </div>
                    <div className="ratting-review">
                      {Object.entries(ratings)
                        .sort((a, b) => b[0] - a[0])
                        .map(([star, percent]) => (
                          <div key={star} className="status_bar_ratting">
                            <span className="number_progress_bar">{star}</span>
                            <div className="progress width_custom">
                              <div
                                role="progressbar"
                                aria-valuenow={percent}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-label={`${star} Star Rating`}
                                className={`progress-bar ${colorClasses[star]}`}
                                style={{ width: `${percent}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
                <div className="assistantBox">
                  <div className="assHeading">
                    {/* <img
                  src="https://aws.astrotalk.com/assets/images/assistant.webp"
                  height="54"
                  width="54"
                  loading="lazy"
                  alt="emergency"
                  className="img-fluid"
                /> */}
                    <span>Chat with Assistant?</span>
                    <a className="float-lg-end fa fa-angle-right"></a>
                  </div>
                </div>
              </div>
              <AstrologerReview
                astrologerData={astrologerData}
                renderStars={renderStars}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
