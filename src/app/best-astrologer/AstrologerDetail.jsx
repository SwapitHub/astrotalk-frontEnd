"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import io from "socket.io-client";
import UserRecharge from "../component/UserRechargePopUp";
import { IoHome, IoStar, IoStarHalf, IoStarOutline,IoCallSharp  } from "react-icons/io5";
import { SiMessenger } from "react-icons/si";

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
  const userMobile = Math.round(secureLocalStorage.getItem("userMobile"));
  const userIds = secureLocalStorage.getItem("userIds");
  const [showRecharge, setShowRecharge] = useState(false);
  const [astroMobileNum, setAstroMobileNum] = useState();
  const [onchangeTabbing, setOnchangeTabbing] = useState("Most_helpful");

  const [userData, setUserData] = useState();

  useEffect(() => {
    if (userMobile) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/user-login-detail/${userMobile}`
        )
        .then((res) => {
          setUserData(res.data);
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
        secureLocalStorage.setItem("astrologerId", astrologerId);

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
  return (
    <>
      {showRecharge && (
        <UserRecharge
          setShowRecharge={setShowRecharge}
          astroMobileNum={astroMobileNum}
        />
      )}

      <div className="container">
        <div className="astrologer_profile_Section">
          <div className="breadcrumb">
            <ul>
              <li>
                <a href="">
                  <span className="icon">
                    <IoHome />
                  </span>
                </a>
                <span className="text">{astrologerData.name}'s Profile</span>
              </li>
            </ul>
          </div>
        </div>

        {/* <!---- Profile image with contact and slider --> */}
        <div className="profile_with_contact_slider">
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
                  <b>181K</b>
                  mins
                </div>

                <div className="call_details">
                  <div className="chat_details">
                    <div className="icon_details">
                    <IoCallSharp />
                    </div>
                    <b>224K</b>
                    mins
                  </div>
                </div>
              </div>

              <div className="btns_chat_call">
                <button className="btns_astrolgers_contact">
                  <div className="icon">
                    {/* <img src="./Images/busy-status-chat.webp" /> */}
                  </div>
                  <div className="start_btn">
                    {astrologerData.chatStatus == false ? (
                      <div className="astrologer-call-button-ctm-detail">
                        {userAmount >= astrologerData.charges * 2 ? (
                          <a
                            href={`/chat-with-astrologer/user/${userIds}`}
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
                            Chat{" "}
                          </a>
                        ) : (
                          <a
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
                            chat
                          </a>
                        )}
                      </div>
                    ) : (
                      <div className="astrologer-call-button-ctm chatStatus-false">
                        <button
                        // onClick={() =>
                        //   onChangeId(item._id, item.mobileNumber)
                        // }
                        >
                          Chat
                        </button>
                        <span>waiting 5 minutes</span>
                      </div>
                    )}
                  </div>
                </button>
                {/* <button className="btns_astrolgers_contact">
                <div className="icon">
                  <img src="./Images/busy-status-call.webp" />
                </div>
                <div className="start_btn call">
                  <div className="strt">Start call</div>
                  <div className="avialable_comming text-danger ng-star-inserted">
                    <div className="ng-star-inserted">Wait time ~ 19m </div>
                  </div>
                </div>
              </button> */}
              </div>
            </div>
          </div>

          {/* <!--- slider --> */}

          <div className="slider_main">
            <div className="slider_inner">
              <div className="slick_slider">
                <div className="slide_item">
                  <div className="slide_inner">
                    {/* <img src="./Images/slider/slide1.png" /> */}
                  </div>
                </div>
                <div className="slide_item">
                  <div className="slide_inner">
                    {/* <img src="./Images/slider/slide2.png" /> */}
                  </div>
                </div>
                <div className="slide_item">
                  <div className="slide_inner">
                    {/* <img src="./Images/slider/slide3.png" /> */}
                  </div>
                </div>
                <div className="slide_item">
                  <div className="slide_inner">
                    {/* <img src="./Images/slider/slide4.png" /> */}
                  </div>
                </div>
                <div className="slide_item">
                  <div className="slide_inner">
                    {/* <img src="./Images/slider/slide4.png" /> */}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <!--- about section --> */}

          <div className="about_us">
            <h2>About me</h2>
            <p>{astrologerData.Description}</p>
          </div>
        </div>

        {/* <!--- rating review --> */}

        <div className="rating_review">
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
                    <div
                      _ngcontent-serverapp-c96=""
                      className="status_bar_ratting"
                    >
                      <span
                        _ngcontent-serverapp-c96=""
                        className="number_progress_bar"
                      >
                        5
                      </span>
                      <div
                        _ngcontent-serverapp-c96=""
                        className="progress width_custom"
                      >
                        <div
                          _ngcontent-serverapp-c96=""
                          role="progressbar"
                          aria-valuenow="75"
                          aria-valuemin="0"
                          aria-valuemax="100"
                          aria-label="Excellent Ratting"
                          className="progress-bar bg_green"
                        ></div>
                      </div>
                    </div>
                    <div
                      _ngcontent-serverapp-c96=""
                      className="status_bar_ratting"
                    >
                      <span
                        _ngcontent-serverapp-c96=""
                        className="number_progress_bar"
                      >
                        4
                      </span>
                      <div
                        _ngcontent-serverapp-c96=""
                        className="progress width_custom"
                      >
                        <div
                          _ngcontent-serverapp-c96=""
                          role="progressbar"
                          aria-valuenow="75"
                          aria-valuemin="0"
                          aria-valuemax="100"
                          aria-label="Good Ratting"
                          className="progress-bar bg_blue"
                        ></div>
                      </div>
                    </div>
                    <div
                      _ngcontent-serverapp-c96=""
                      className="status_bar_ratting"
                    >
                      <span
                        _ngcontent-serverapp-c96=""
                        className="number_progress_bar"
                      >
                        3
                      </span>
                      <div
                        _ngcontent-serverapp-c96=""
                        className="progress width_custom"
                      >
                        <div
                          _ngcontent-serverapp-c96=""
                          role="progressbar"
                          aria-valuenow="75"
                          aria-valuemin="0"
                          aria-valuemax="100"
                          aria-label="Average Ratting"
                          className="progress-bar bg_light_green"
                        ></div>
                      </div>
                    </div>
                    <div
                      _ngcontent-serverapp-c96=""
                      className="status_bar_ratting"
                    >
                      <span
                        _ngcontent-serverapp-c96=""
                        className="number_progress_bar"
                      >
                        2
                      </span>
                      <div
                        _ngcontent-serverapp-c96=""
                        className="progress width_custom"
                      >
                        <div
                          _ngcontent-serverapp-c96=""
                          role="progressbar"
                          aria-valuenow="75"
                          aria-valuemin="0"
                          aria-valuemax="100"
                          aria-label="Poor Ratting"
                          className="progress-bar bg_brown"
                        ></div>
                      </div>
                    </div>
                    <div
                      _ngcontent-serverapp-c96=""
                      className="status_bar_ratting"
                    >
                      <span
                        _ngcontent-serverapp-c96=""
                        className="number_progress_bar"
                      >
                        1
                      </span>
                      <div
                        _ngcontent-serverapp-c96=""
                        className="progress width_custom"
                      >
                        <div
                          _ngcontent-serverapp-c96=""
                          role="progressbar"
                          aria-valuenow="75"
                          aria-valuemin="0"
                          aria-valuemax="100"
                          aria-label="Very Poor Ratting"
                          className="progress-bar bg_voilet"
                        ></div>
                      </div>
                    </div>
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
            <div className="similar_consultants_section">
              <div className="header_similar_consultants">
                <h2 className="check_similar_text">
                  Check Similar Consultants
                </h2>
                <i
                  _ngcontent-serverapp-c96=""
                  className="fa fa-info-circle"
                ></i>
              </div>
              <div className="reviews-similiar-conslt-outer">
                <div className="reviews-similiar-conslt-inner">
                  <h2 className="review-heading">User Reviews</h2>
                  <div className="sort-filter-rating">
                    <div className="sort-left">
                      <h6> Sort By</h6>
                    </div>
                    <div className="sort-right">
                      <div className="sort-radio">
                        <input
                          type="radio"
                          name="sort"
                          checked={onchangeTabbing === "Most_helpful"}
                          id="helpful_reviews "
                          onChange={() => {
                            setOnchangeTabbing("Most_helpful");
                          }}
                        />
                        <label for="helpful_reviews">Most helpful</label>
                      </div>
                      <div className="sort-radio">
                        <input
                          type="radio"
                          name="sort"
                          checked={onchangeTabbing === "Most_Recent"}
                          id="recent_reviews"
                          onChange={() => {
                            setOnchangeTabbing("Most_Recent");
                          }}
                        />
                        <label for="recent_reviews">Most Recent</label>
                      </div>
                    </div>
                  </div>
                  {onchangeTabbing == "Most_helpful" && (
                    <div className="similar-conslt-reviews-sec">
                      {astrologerData?.reviews.map((item) => {
                        return (
                          <>
                            <div className="single-review">
                              <div className="profile-image-name">
                                <div className="picture_profile">
                                  <img src="" alt="" />
                                </div>
                                <div className="name-text">
                                  <span>{item.userName}</span>
                                </div>
                              </div>
                              <div className="rating-stars">
                                <ul class="stars">
                                  <li>{renderStars(item?.rating)}</li>
                                </ul>
                              </div>
                              <div className="review-content">
                                <p>{item.review}</p>
                              </div>
                            </div>
                          </>
                        );
                      })}
                    </div>
                  )}
                 {onchangeTabbing == "Most_Recent" && (
                    <div className="similar-conslt-reviews-sec">
                      {astrologerData?.reviews.map((item) => {
                        return (
                          <>
                            <div className="single-review">
                              <div className="profile-image-name">
                                <div className="picture_profile">
                                  <img src="" alt="" />
                                </div>
                                <div className="name-text">
                                  <span>{item.userName}</span>
                                </div>
                              </div>
                              <div className="rating-stars">
                                <ul class="stars">
                                  <li>{renderStars(item?.rating)}</li>
                                </ul>
                              </div>
                              {/* <div className="review-content">
                                <p>{item.review}</p>
                              </div> */}
                            </div>
                          </>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
