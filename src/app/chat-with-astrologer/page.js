"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import UserRecharge from "../component/UserRechargePopUp";
import Link from "next/link";
import secureLocalStorage from "react-secure-storage";
const socket = io(`${process.env.NEXT_PUBLIC_WEBSITE_URL}`);

const ChatWithAstrologer = () => {
  const [showAstrologer, setShowAstrologer] = useState();
  const userIds = secureLocalStorage.getItem("userIds");
  const userMobile = Math.round(secureLocalStorage.getItem("userMobile"));
  const [showRecharge, setShowRecharge] = useState(false);
  const [userData, setUserData] = useState();
  const [astroMobileNum, setAstroMobileNum] = useState();
  const router = useRouter();

  const fetchData = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/astrologer-businessProfile`)
      .then((res) => {
        setShowAstrologer(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    fetchData();
  }, [userData]);

  useEffect(() => {
    if(userMobile){
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

  useEffect(() => {
    if (showRecharge) {
      document.body.classList.add("user-recharge");
    } else {
      document.body.classList.remove("user-recharge");
    }
  }, [showRecharge]);

  const userAmount = userData?.totalAmount;

  const onChangeId = async (
    astrologerId,
    mobileNumber,
    profileImage,
    astroName,
    astroCharge,
    astroExperience
  ) => {
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
          profileImage: profileImage,
          astroName: astroName,
          astroCharges: astroCharge,
          astroExperience: astroExperience,
          chatId: "",
          chatType: "free",
          chatDuration: "0 min",
          chatDeduction: "0",
          DeleteOrderHistoryStatus: true, 
          chatStatus: true,
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
  return (
    <>
      {showRecharge && (
        <UserRecharge
          setShowRecharge={setShowRecharge}
          astroMobileNum={astroMobileNum}
        />
      )}

      <section className="talk-to-astrologer-bg">
        <div className="container">
          <div className="inner-talk-to-astrologer">
            <div className="talk-to-astrologer-left-content">
              <div className="heading-button">
                <span>Talk to Astrologer</span>
              </div>
              <div className="available-bbalance-text">
                <p>
                  Available balance: <span>₹ {userData?.totalAmount}</span>
                </p>
              </div>
            </div>
            <div className="talk-to-astrologer-right-content">
              <div className="inner-talk-to-astrologer-right-content">
                <div className="recharge-btm">
                  <Link href="/add-wallet-money/price-list" title="Recharge" className="recharge-button">
                    Recharge
                  </Link>
                </div>
                <div className="filter-button">
                  <a href="#" title="Recharge" className="filter-btn-ctm">
                    <i
                      _ngcontent-serverapp-c100=""
                      className="fa fa-filter"
                    ></i>
                    Filter
                  </a>
                </div>
                <div className="filter-button">
                  <a href="#" title="Recharge" className="sort-btn-ctm">
                    <i
                      _ngcontent-serverapp-c100=""
                      className="fa fa-sort-amount-desc"
                    ></i>{" "}
                    Sort by{" "}
                  </a>
                </div>
                <div className="filter-button search-box-top-btn">
                  <div className="search-box-filed">
                    <input
                      type="search"
                      id="gsearch"
                      name="gsearch"
                      placeholder="Search name..."
                    />
                  </div>
                  <div className="search-button-filed">
                    <button type="submit">
                      <i className="fa fa-search"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="all-list-talk-to-astrologer">
            {showAstrologer?.map((item) => {
              return (
                <>
                  {item.profileStatus == true && (
                    <div className="inner-astrologer-detail" key={item.id}>
                      <div className="astrologer-list-left">
                        <div className="astrologer-profile">
                          <a href="#" title="Shriniwas">
                            {" "}
                            <img
                              src={`./images/${item?.profileImage}`}
                              alt="Sauvikh"
                            />
                          </a>
                        </div>
                        <div className="five-star-rating">
                          <ul>
                            <li>
                              <i className="fa-solid fa-star"></i>
                            </li>
                            <li>
                              <i className="fa-solid fa-star"></i>
                            </li>
                            <li>
                              <i className="fa-solid fa-star"></i>
                            </li>
                            <li>
                              <i className="fa-solid fa-star"></i>
                            </li>
                            <li>
                              <i className="fa-solid fa-star"></i>
                            </li>
                          </ul>
                        </div>
                        <div className="talk-to-total-orders">
                          <p> 3673 orders</p>
                        </div>
                      </div>
                      <div className="astrologer-list-center">
                        <div className="talk-to-name-sec">
                          <h5>
                            <a href="#" title="Shriniwas">
                              {item.name}
                            </a>
                          </h5>
                          <p>{item.profession}</p>
                        </div>
                        <div className="talk-to-language">
                          <p>
                            <span>{item.languages}</span>
                          </p>
                        </div>
                        <div className="exp-year-sec">
                          <p>
                            Exp:{" "}
                            <span className="ctm-carly-breaks">
                              {item.experience}
                            </span>{" "}
                            Years
                          </p>
                        </div>
                        <div className="talk-to-time-sec">
                          <p>
                            ₹ {item.charges}{" "}
                            <span>
                              {/* <span className="ctm-carly-breaks">
                                {item.minute}
                              </span> */}
                              <span className="ctm-carly-breaks">/</span> 
                              {" "} min
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="astrologer-list-right">
                        <div className="Verified-Sticker-icon">
                          <img
                            src="./Verified-Sticker.png"
                            alt="Verified Sticker"
                          />
                        </div>

                        {item.chatStatus == false ? (
                          <div className="astrologer-call-button-ctm">
                            {userAmount >= item.charges * 2 ? (
                              <a
                                href={`/chat-with-astrologer/user/${userIds}`}
                                onClick={() =>
                                  onChangeId(
                                    item._id,
                                    item.mobileNumber,
                                    item.profileImage,
                                    item.name,
                                    item.charges,
                                    item.experience
                                  )
                                }
                              >
                                Chat{" "}
                              </a>
                            ) : (
                              <button
                                onClick={() =>
                                  onChangeId(
                                    item._id,
                                    item.mobileNumber,
                                    item.profileImage,
                                    item.name,
                                    item.charges,
                                    item.experience
                                  )
                                }
                              >
                                chat
                              </button>
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
                    </div>
                  )}
                </>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default ChatWithAstrologer;
