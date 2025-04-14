"use client";
import axios from "axios";
import Link from "next/link";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { MdDelete } from "react-icons/md";
import secureLocalStorage from "react-secure-storage";

const ChatHistory = () => {
  const userIds = secureLocalStorage.getItem("userIds");
  const [astroMessageList, setAstroMessageList] = useState([]);


  const deleteOrderHistory = async (id) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/userId-to-astrologer-astro-list-update/${id}`,
        { DeleteOrderHistoryStatus: false }
      );
  
      // Fetch the updated data after deletion
      fetchAstroMessageList();
    } catch (error) {
      console.error("Error deleting order history:", error);
    }
  };
  
  const fetchAstroMessageList = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/userId-to-astrologer-astro-list/${userIds}`
      );
      setAstroMessageList(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };
  
  useEffect(() => {
    fetchAstroMessageList();
  }, [userIds]);
  


  return (
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
                {astroMessageList.map((item) => {
                  return (
                    <>
                      {item?.DeleteOrderHistoryStatus == true && (
                        <div className="inner-ctm-chat-with-astrologer">
                          <div className="inner-ctm-chat-with-astrologer-top">
                            <a href={`/chat-with-astrologer/user/${item?.userIdToAst}`} onClick={secureLocalStorage.setItem("astrologerId",item?.astrologerIdToAst)}>
                              <div className="order-id-sec">
                                <ul>
                                  <li>
                                    <p>Order Id: {item?.astrologerIdToAst}</p>
                                  </li>
                                  <li className="help-list-button-ctm">
                                    <button
                                      type="button"
                                      className="help-ctm-ctm"
                                    >
                                      HELP
                                    </button>
                                    <div className="images">
                                      <img
                                        src={`/images/${item.profileImage}`}
                                        alt=""
                                      />
                                    </div>
                                  </li>
                                </ul>
                              </div>
                              {/* <div className="chat-astrologer-name-sec">
                              <h5>{item.astroName}</h5>
                              <p>Vedic, Numerology, Vastu</p>
                            </div> */}
                              <div className="date-and-tine-sec">
                                <p>
                                  {new Date(item.createdAt).toLocaleString()}
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
                                  Chat Type - <span>{item?.chatType}</span>{" "}
                                </p>
                              </div>
                              <div className="call-rate-text">
                                <p>Rate: ₹ ${item.astroCharges}/min </p>
                              </div>
                              <div className="call-rate-text">
                                <p>Duration: {item?.chatDuration} second</p>
                              </div>
                              <div className="duration-history-text">
                                <p>Deduction: ₹ {item?.chatDeduction}.00 </p>
                              </div>
                            </a>
                          </div>
                          <div className="inner-ctm-chat-with-astrologer-botton">
                            <div className="share-with-frnds-chat">
                              <p>
                                <a href="#" title="Share with your friends">
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatHistory;
