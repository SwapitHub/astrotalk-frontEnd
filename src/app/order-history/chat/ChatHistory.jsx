"use client";
import DeleteChatPopUp from "@/app/component/DeleteChatPopUp";
import Loader from "@/app/component/Loader";
import RequestPopUp from "@/app/component/RequestPopUp";
import SharePopUp from "@/app/component/SharePopUp";
import UserOtpLoginData from "@/app/component/UserOtpLoginData";
import UserRecharge from "@/app/component/UserRechargePopUp";
import { fetchUserLoginDetails } from "@/app/utils/api";
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { MdDelete } from "react-icons/md";
import InfiniteScroll from "react-infinite-scroll-component";
import secureLocalStorage from "react-secure-storage";
import io from "socket.io-client";

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

const ChatHistory = () => {
  const router = useRouter();

  const [userIds, setUserIds] = useState();
  const [userMobile, setUserMobile] = useState();
  const [showRecharge, setShowRecharge] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [userData, setUserData] = useState();
  const [astroMobileNum, setAstroMobileNum] = useState();
  const [astroMessageList, setAstroMessageList] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [otpPopUpDisplay, setOtpPopUpDisplay] = useState(false);
  const [shareOpenPopup, setShareOpenPopup] = useState(false);
  const [showUserIdToAst, setShowUserIdToAst] = useState(
    secureLocalStorage.getItem("userIdToAst")
  );
  const [astrologerIdToAst, setAstrologerIdToAst] = useState(
    secureLocalStorage.getItem("astrologerIdToAst")
  );
  const [isLoadingRequest, setIsLoadingRequest] = useState(
    secureLocalStorage.getItem("IsLoadingRequestStore")
  );
  const [astrologerNotificationStatus, setAstrologerNotificationStatus] =
    useState(null);
  const [astrologerId, setAstrologerId] = useState();

  console.log("====auserMobile", userMobile, userData);
  const deleteOrderHistory = (id) => {
    setShowDelete(true);
    setDeleteId(id);
  };

  useEffect(() => {
    const userMobiles = Math.round(Cookies.get("userMobile"));
    const userId = Cookies.get("userIds");
    setUserMobile(userMobiles);
    setUserIds(userId);
  }, []);

 useEffect(() => {
    document.body.classList.remove(
      "loading-user-filter-popup"
    );   
     if (isLoadingRequest) {
      document.body.classList.add("loading-user-filter-popup");
    }
  }, [isLoadingRequest]);

  useEffect(() => {
    if (showRecharge) {
      document.body.classList.add("user-recharge");
    } else {
      document.body.classList.remove("user-recharge");
    }

    if (showDelete) {
      document.body.classList.add("delete-chat-popup");
    } else {
      document.body.classList.remove("delete-chat-popup");
    }

    if (shareOpenPopup) {
      document.body.classList.add("share-open-popup");
    } else {
      document.body.classList.remove("share-open-popup");
    }
  }, [showRecharge, showDelete, shareOpenPopup]);

 const fetchAstroMessageList = async () => {
  console.log("Fetching page", page); 

  setIsLoading(true);
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_WEBSITE_URL}/userId-to-astrologer-astro-list/${userIds}?page=${page}&limit=4`
    );

    const newMessages = response.data.data;

    setAstroMessageList((prev) => [...prev, ...newMessages]);
    setHasMore(response.data.hasMore);
    setPage((prev) => prev + 1);
  } catch (error) {
    console.error("Error fetching messages:", error);
  } finally {
    setIsLoading(false);
  }
};


  // Filter out deleted item locally after success
  const handleDeleteSuccess = (id) => {
    setAstroMessageList((prev) => prev.filter((item) => item._id !== id));
  };

  useEffect(() => {
    // Reset state if userIds changes
    setAstroMessageList([]);
    setPage(1);
    setHasMore(true);
  }, [userIds]);

  useEffect(() => {
    if (page == 1 ) {
      fetchAstroMessageList();
    }
  }, [userIds, page]);

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
      return;
    }
    if (userAmount >= astroCharge * 2) {
      try {
        // Navigate to the chat page
        // await router.push(`/chat-with-astrologer/user/${userIds}`);

        // This code will run after the navigation is complete
        secureLocalStorage.setItem("IsLoadingRequestStore", true);
        setIsLoadingRequest(true);

        Cookies.set("astrologerId", astrologerId , {
           expires: 3650,
              secure: true,
              sameSite: "Strict",
        });

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

  const handelUserLogin = () => {
    setOtpPopUpDisplay(true);
  };

  useEffect(() => {
    if (isLoadingRequest) {
      if (astrologerId) {
        router.push(`/chat-with-astrologer/user/${userIds}`);
        Cookies.set("astrologerId", astrologerId);

        secureLocalStorage.setItem("IsLoadingRequestStore", false);
        setIsLoadingRequest(false);
      } else {
        setIsLoadingRequest(true);
        secureLocalStorage.setItem("IsLoadingRequestStore", true);

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
          Cookies.set("AstrologerNotificationStatus", newStatus);
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

  console.log(showUserIdToAst);

  const showSharePopUp = (userIdToAst, astrologerIdToAst) => {
    console.log(userIdToAst);
    secureLocalStorage.setItem("userIdToAst", userIdToAst);
    secureLocalStorage.setItem("astrologerIdToAst", astrologerIdToAst);
    setShareOpenPopup(true);
    setShowUserIdToAst(userIdToAst);
    setAstrologerIdToAst(astrologerIdToAst);
  };

  return (
    <>
      {
        <SharePopUp
          setShareOpenPopup={setShareOpenPopup}
          showUserIdToAst={showUserIdToAst}
          astrologerIdToAst={astrologerIdToAst}
        />
      }

      {showDelete && (
        <DeleteChatPopUp
          deleteId={deleteId}
          setShowDelete={setShowDelete}
          onDeleteSuccess={handleDeleteSuccess}
        />
      )}

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
      <section className="my-order-hisrory-bg">
        <div className="container">
          <div className="wallet-transactions-tabs">
            <div className="my-wallet-sec-transactions-tabs">
              <div className="my-wallet-sec-heading-content">
                <h1 className="common-h1-heading">Order History</h1>
              </div>
              <div className="wallet-ctm-tab-menu ">
                <ul>
                  {/* <li>
                  <Link
                    href="/order-history/call"
                    className="wallet-ctm-tab-a"
                    data-id="wallet-ctm-tab1"
                  >
                    Call
                  </Link>
                 </li> */}
                  <li>
                    <Link
                      href="/order-history/chat"
                      className="wallet-ctm-tab-a wallet-ctm-active-a"
                      data-id="wallet-ctm-tab2"
                    >
                      Chat
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/order-history/report"
                      className="wallet-ctm-tab-a"
                      data-id="wallet-ctm-tab3"
                    >
                      Report
                    </Link>
                  </li>
                  <li>
                    <Link
                      title="/order-history/astro-mall"
                      href=""
                      className="wallet-ctm-tab-a"
                      data-id="wallet-ctm-tab4"
                    >
                      Astromall
                    </Link>
                  </li>
                </ul>
              </div>
              {isLoading && <Loader />}
              <div
                className="wallet-ctm-tab wallet-ctm-tab-active"
                data-id="wallet-ctm-tab1"
              >
                <div className="ctm-chat-with-astrologer">
                  <InfiniteScroll
                    dataLength={astroMessageList?.length}
                    next={fetchAstroMessageList}
                    hasMore={hasMore} // ✅ Boolean
                    loader={<Loader />}
                    scrollThreshold={0.9} // Trigger load when 90% scrolled
                  >
                    <div className="inner-scroll">
                      {astroMessageList.map((item) => {
                        return (
                          <>
                            {item?.DeleteOrderHistoryStatus == true && (
                              <div className="inner-ctm-chat-with-astrologer">
                                <div className="inner-ctm-chat-with-astrologer-top">
                                  <div className="order-list-data-wrap">
                                    <div className="order-id-sec">
                                      <ul>
                                        <li>
                                          <p>
                                            Order Id: {item?.astrologerIdToAst}
                                          </p>
                                        </li>

                                        <li className="help-list-button-ctm">
                                          <button
                                            type="button"
                                            className="help-ctm-ctm"
                                          >
                                            HELP
                                          </button>
                                        </li>
                                      </ul>
                                    </div>

                                    <div className="outer-order-list-data">
                                      <div
                                        className="inner-order-list-data"
                                        onClick={() => {
                                          secureLocalStorage.setItem(
                                            "astrologerId",
                                            item?.astrologerIdToAst
                                          );
                                          router.push(
                                            `/chat-with-astrologer/user/${item?.userIdToAst}/?user=order-history`
                                          );
                                        }}
                                      >
                                        <div className="date-and-tine-sec">
                                          <p>
                                            {new Date(
                                              item.createdAt
                                            ).toLocaleString()}
                                          </p>
                                        </div>
                                        <div className="chat-completed-content">
                                          <p className="ctm-color-green">
                                            {item?.chatStatus == false
                                              ? "completed"
                                              : "pending"}{" "}
                                          </p>
                                        </div>
                                        <div className="call-rate-text">
                                          <p className="ctm-color-green">
                                            Chat Type -{" "}
                                            <span>{item?.chatType}</span>{" "}
                                          </p>
                                        </div>
                                        <div className="call-rate-text">
                                          <p>
                                            Rate: ₹ ${item.astroCharges}/min{" "}
                                          </p>
                                        </div>
                                        <div className="call-rate-text">
                                          <p>
                                            Astrologer Name: {item.astroName}{" "}
                                          </p>
                                        </div>
                                        <div className="call-rate-text">
                                          <p>
                                            Duration: {item?.chatDuration}{" "}
                                            second
                                          </p>
                                        </div>
                                        <div className="duration-history-text">
                                          <p>
                                            Deduction: ₹ {item?.chatDeduction}
                                            .00{" "}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="outer-hide-div-img-text">
                                        {item.profileStatus == true && (
                                          <div className="hide-div-img-text">
                                            <div className="images">
                                              <img
                                                src={`https://aws.astrotalk.com/consultant_pic/p-106783.jpg`}
                                                alt=""
                                              />
                                            </div>
                                            <div className="price">
                                              $ {item?.astroCharges}
                                            </div>
                                            <div className="astrologer-list-right">
                                              {/* <div className="Verified-Sticker-icon">
                                              <img
                                                src="/Verified-Sticker.png"
                                                alt="Verified Sticker"
                                              />
                                            </div> */}

                                              {item.chatStatus == false ? (
                                                <div className="astrologer-call-button-ctm">
                                                  {!userData?.name ? (
                                                    <Link href="/free-chat/start">
                                                      Chat
                                                    </Link>
                                                  ) : userAmount >=
                                                    item.charges * 2 ? (
                                                    <Link
                                                      href="#"
                                                      onClick={() => {
                                                        onChangeId(
                                                           item.astrologerIdToAst,
                                                          item.mobileNumber,
                                                          // item.profileImage,
                                                          item.astroName,
                                                          item.astroCharges,
                                                          item.astroExperience
                                                        );
                                                      }}
                                                    >
                                                      Chat
                                                    </Link>
                                                  ) : !userMobile ||
                                                    !userIds ? (
                                                    <Link
                                                      href="#"
                                                      onClick={handelUserLogin}
                                                    >
                                                      chat
                                                    </Link>
                                                  ) : (
                                                    <Link
                                                      href="#"
                                                      onClick={() =>
                                                        onChangeId(
                                                          item.astrologerIdToAst,
                                                          item.mobileNumber,
                                                          // item.profileImage,
                                                          item.astroName,
                                                          item.astroCharges,
                                                          item.astroExperience

                                                          
                                                        )
                                                      }
                                                    >
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
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="inner-ctm-chat-with-astrologer-botton">
                                  <div className="share-with-frnds-chat">
                                    <p>
                                      <button
                                        onClick={() =>
                                          showSharePopUp(
                                            item?.userIdToAst,
                                            item?.astrologerIdToAst
                                          )
                                        }
                                      >
                                        <img
                                          src="/what-sap-icon.webp"
                                          alt="whatsapp"
                                        />
                                        <span>Share with your friends</span>{" "}
                                      </button>
                                    </p>
                                  </div>

                                  <div
                                    className="history-delete-button-ctm"
                                    onClick={() => {
                                      deleteOrderHistory(item._id);
                                    }}
                                  >
                                    <MdDelete />
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
                        );
                      })}
                    </div>
                  </InfiniteScroll>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ChatHistory;
