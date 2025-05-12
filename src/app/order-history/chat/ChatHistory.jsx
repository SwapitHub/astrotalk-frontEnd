"use client";
import DeleteChatPopUp from "@/app/component/DeleteChatPopUp";
import Loader from "@/app/component/Loader";
import UserRecharge from "@/app/component/UserRechargePopUp";
import { fetchUserLoginDetails } from "@/app/utils/api";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { MdDelete } from "react-icons/md";
import InfiniteScroll from "react-infinite-scroll-component";
import secureLocalStorage from "react-secure-storage";
import io from "socket.io-client";
const socket = io(`${process.env.NEXT_PUBLIC_WEBSITE_URL}`);

const ChatHistory = () => {
  const router = useRouter();
  const userIds = secureLocalStorage.getItem("userIds");
  const userMobile = secureLocalStorage.getItem("userMobile");
  const [showRecharge, setShowRecharge] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [userData, setUserData] = useState();
  const [astroMobileNum, setAstroMobileNum] = useState();
  const [astroMessageList, setAstroMessageList] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  console.log(astroMessageList);

  const deleteOrderHistory = (id) => {
    setShowDelete(true);
    setDeleteId(id);
  };

  useEffect(() => {
    if (showRecharge) {
      document.body.classList.add("user-recharge");
    } else {
      document.body.classList.remove("user-recharge");
    }
  }, [showRecharge]);

  const fetchAstroMessageList = async () => {
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
    if (page === 1) {
      fetchAstroMessageList();
    }
  }, [userIds, page]);

  const fetchDataUserDetail = async () => {
    try {
      const data = await fetchUserLoginDetails(userMobile);
      setUserData(data);
    } catch (error) {
      console.error("Error fetching fetchDataUserDetail:", error);
    }
  };
  useEffect(() => {
    fetchDataUserDetail();
  }, []);

  const userAmount = userData?.totalAmount;

  const onChangeId = async (
    astrologerId,
    mobileNumber,
    profileImage,
    astroName,
    astroCharge,
    astroExperience,
    profileStatus
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
          profileStatus: profileStatus,
        };
        console.log("messageId", messageId, profileStatus);

        socket.emit("userId-to-astrologer", messageId);
      } catch (error) {
        console.error("Navigation failed:", error);
      }
    } else {
      setShowRecharge(true);
      setAstroMobileNum(mobileNumber);
    }
  };

  return (
    <>
      {showDelete && (
        <DeleteChatPopUp
          deleteId={deleteId}
          setShowDelete={setShowDelete}
          onDeleteSuccess={handleDeleteSuccess}
        />
      )}
      {showRecharge && (
        <UserRecharge
          setShowRecharge={setShowRecharge}
          astroMobileNum={astroMobileNum}
        />
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
              <div
                className="wallet-ctm-tab wallet-ctm-tab-active"
                data-id="wallet-ctm-tab1"
              >
                <div className="ctm-chat-with-astrologer">
                  <InfiniteScroll
                    dataLength={astroMessageList?.length}
                    next={fetchAstroMessageList}
                    hasMore={<Loader/>}
                    scrollThreshold={0.9} // Trigger load when 90% scrolled
                  >
                    <div className="inner-scroll">
                      {astroMessageList.map((item) => {
                        return (
                          <>
                            {item?.DeleteOrderHistoryStatus == true && (
                              <div className="inner-ctm-chat-with-astrologer">
                                <div className="inner-ctm-chat-with-astrologer-top">
                                  <div className="outer-order-list-data">
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
                                          {item.profileStatus == true && (
                                            <div className="hide-div-img-text">
                                              <div className="images">
                                                <img
                                                  src={`/images/${item.profileImage}`}
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
                                                    {userAmount >=
                                                    item.astroCharges * 2 ? (
                                                      <a
                                                        href={`/chat-with-astrologer/user/${userIds}`}
                                                        onClick={() =>
                                                          onChangeId(
                                                            item.astrologerIdToAst,
                                                            item.mobileNumber,
                                                            item.profileImage,
                                                            item.astroName,
                                                            item.astroCharges,
                                                            item.astroExperience,
                                                            item.profileStatus
                                                          )
                                                        }
                                                      >
                                                        Chat{" "}
                                                      </a>
                                                    ) : (
                                                      <button
                                                        onClick={() =>
                                                          onChangeId(
                                                            item.astrologerIdToAst,
                                                            item.mobileNumber,
                                                            item.profileImage,
                                                            item.astroName,
                                                            item.astroCharges,
                                                            item.astroExperience,
                                                            item.profileStatus
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
                                                    <span>
                                                      waiting 5 minutes
                                                    </span>
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          )}
                                        </li>
                                      </ul>
                                    </div>

                                    <div
                                      className="inner-order-list-data"
                                      onClick={() => {
                                        secureLocalStorage.setItem(
                                          "astrologerId",
                                          item?.astrologerIdToAst
                                        );
                                        router.push(
                                          `/chat-with-astrologer/user/${item?.userIdToAst}`
                                        );
                                      }}
                                    >
                                      {/* <div className="chat-astrologer-name-sec">
                              <h5>{item.astroName}</h5>
                              <p>Vedic, Numerology, Vastu</p>
                            </div> */}
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
                                        <p>Rate: ₹ ${item.astroCharges}/min </p>
                                      </div>
                                      <div className="call-rate-text">
                                        <p>
                                          Duration: {item?.chatDuration} second
                                        </p>
                                      </div>
                                      <div className="duration-history-text">
                                        <p>
                                          Deduction: ₹ {item?.chatDeduction}.00{" "}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="inner-ctm-chat-with-astrologer-botton">
                                  <div className="share-with-frnds-chat">
                                    <p>
                                      <a
                                        href="#"
                                        title="Share with your friends"
                                      >
                                        <img
                                          src="/what-sap-icon.webp"
                                          alt="whatsapp"
                                        />
                                        <span>Share with your friends</span>{" "}
                                      </a>
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
