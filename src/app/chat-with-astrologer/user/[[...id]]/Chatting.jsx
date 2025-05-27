"use client";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRef } from "react";
import secureLocalStorage from "react-secure-storage";
import EndChatPopUp from "@/app/component/EndChatPopUp";
import RatingPopUp from "@/app/component/RatingPopUp";
import { useRouter, useSearchParams } from "next/navigation";


const socket = io(process.env.NEXT_PUBLIC_WEBSITE_URL, {
  transports: ["websocket"],
  reconnection: true,
});

export default function Chatting({AdminCommissionData, userIdUrl}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userParam = searchParams.get("user");
  const astrologerIdToAst = searchParams.get("astrologerIdToAst");
 console.log(astrologerIdToAst,userIdUrl,"astrologerIdToAst==================");

  const [showUserData, setShowUserData] = useState();
  const totalChatTime = Math.round(secureLocalStorage.getItem("totalChatTime"));
  const [timeLeft, setTimeLeft] = useState(null);
  const [actualChargeUserChat, setActualChargeUserChat] = useState();
  console.log(showUserData?.freeChatStatus === true, actualChargeUserChat);

  const [showEndChat, setShowEndChat] = useState(false);
  const [showRating, setShowRating] = useState(false);
  console.log("AdminCommissionData", AdminCommissionData);

  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);
  const [message, setMessage] = useState("");
  const [messageData, setMessageData] = useState([]);
  const [astrologerData, setAstrologerData] = useState("");
  const [astrologerId, setAstrologerId] = useState();
  const userIds = secureLocalStorage.getItem("userIds");
  const userMobile = Math.round(secureLocalStorage.getItem("userMobile"));

  const [astrologerNotificationStatus, setAstrologerNotificationStatus] =
    useState(() => secureLocalStorage.getItem("AstrologerNotificationStatus"));
  const mobileRef = useRef(null);

  useEffect(() => {
    if (showUserData?.freeChatStatus === true) {
      setActualChargeUserChat(0);
    }
  }, [showUserData?.freeChatStatus]);



  useEffect(() => {
    if (
      astrologerNotificationStatus === false &&
      showRating === false &&
      userParam !== "order-history"
    ) {
      router.push("/chat-with-astrologer");
    }
  }, [astrologerNotificationStatus, showRating]);

  useEffect(() => {
    const id = secureLocalStorage.getItem("astrologerId");
    
    if (id || astrologerIdToAst) {
      setAstrologerId(id || astrologerIdToAst);
    }
  }, [astrologerIdToAst]);

  useEffect(() => {
    const storedTime = secureLocalStorage.getItem("chatTimeLeft");

    if (storedTime) {
      setTimeLeft(parseInt(storedTime, 10));
    } else {
      if (
        astrologerNotificationStatus === false ||
        astrologerNotificationStatus === "false"
      ) {
        setTimeLeft(0);
      } else {
        setTimeLeft(null);
      }
    }
  }, [astrologerNotificationStatus]);

  useEffect(() => {
    if (astrologerData?.mobileNumber) {
      mobileRef.current = astrologerData.mobileNumber;
    }

    const storedNotification = secureLocalStorage.getItem(
      "AstrologerNotificationStatus"
    );
    if (storedNotification) {
      setAstrologerNotificationStatus(storedNotification);
    }
  }, [astrologerData]);

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (data) => {
      console.log("Received data:", data.astrologerData);
      secureLocalStorage.setItem("astrologerId", data.astrologerData?._id);
      setAstrologerId(data.astrologerData?._id);
      console.log(data.astrologerData?._id);

      // Ensure the comparison is with the latest astrologer mobile number
      if (
        data.astrologerData?.mobileNumber === mobileRef.current ||
        showUserData?.freeChatStatus == false
      ) {
        console.log("Updating notification status...");

        const newStatus = data.astrologerData.chatStatus;

        // Ensure state actually changes
        setAstrologerNotificationStatus((prevStatus) => {
          if (prevStatus !== newStatus) {
            secureLocalStorage.setItem(
              "AstrologerNotificationStatus",
              newStatus
            );
            return newStatus;
          }
          return prevStatus;
        });
      }
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
  }, [socket, astrologerData]);

  useEffect(() => {
    const fetchAstrologerData = () => {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}/astrologer-businessProfile/${astrologerId}`
        )
        .then((response) => {
          setAstrologerData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching astrologer data:", error);
        });
    };

    fetchAstrologerData();
  }, [astrologerId]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/chat/detail/${userIds || userIdUrl}/${astrologerId }`
      );
      setMessageData(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const chatContainerRef = useRef(null);

  // Scroll to the bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messageData]); // scroll when new messages arrive

  // auto send message first time user to astrologer

  const sendMessage = async () => {
    if (!message.trim()) return;

    const now = new Date();
    const hours = now.getHours() % 12 || 12;
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = now.getHours() >= 12 ? "PM" : "AM";
    const time = `${hours}:${minutes} ${ampm}`;

    try {
      const newMessage = {
        user: showUserData?.name,
        message: message,
        time: time,
        members: [userIds, astrologerId],
      };

      // Emit the message to the server
      socket.emit("sendMessage", newMessage);
      setMessage(""); // Clear the input field
      scrollToBottom();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const scrollToBottom = () => {
    const chatContainer = document.querySelector(".chat-container");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    if (!astrologerId || !userIds || !socket ) return;

    socket.emit("joinChat", { userIds, astrologerId });

    fetchMessages();

    socket.on("receiveMessage", (msg) => {
      setMessageData((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [astrologerId, userIds, socket, userIdUrl]); // Watch these dependencies

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/user-login-detail/${userMobile}`
      )
      .then((res) => {
        setShowUserData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [userMobile]);


  // Automatically end chat after 120 seconds (when timer hits 0) for free chat
  useEffect(() => {
    if (timeLeft === 120 && showUserData?.freeChatStatus === true) {
      console.log("actualChargeUserChat============");

      endChatStatus();
    }
  }, [timeLeft, showUserData?.freeChatStatus]);

  const endChatStatus = async () => {
    console.log("actualChargeUserChat", actualChargeUserChat);

    if (actualChargeUserChat == undefined) return;
    console.log("===============sasasa");

    if (
      showUserData?.freeChatStatus == true ||
      showUserData?.chatStatus == true
    ) {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/update-user/${userMobile}`,
        {
          freeChatStatus: false,
          chatStatus: false,
        }
      );
      console.log("response", response.data);
    }

    if (
      astrologerNotificationStatus == false ||
      astrologerNotificationStatus == "false"
    )
      return;
    clearTimeout(timeoutRef.current);
    clearInterval(intervalRef.current);
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/update-astro-status-by-mobile/${astrologerData.mobileNumber}`,
        {
          chatStatus: false,
        }
      );

      if (response.data.message === "Success") {
        toast.error("End Chat Successfully", {
          position: "top-right",
        });

        // Update state and secureLocalStorage
        setTimeLeft(null);
        secureLocalStorage.removeItem("chatTimeLeft");

        const updatedAstrologerData = response.data.updatedProfile;

        socket.emit("astrologer-chat-status", updatedAstrologerData);

        const newUserDetail = {
          userId: userIds,
          totalChatTime: totalChatTime,
          astrologerChargePerMinute: Math.round(astrologerData.charges),
          astrologerName: astrologerData.name,
          username: showUserData?.name,
          userAvailableBalance: showUserData.totalAmount,
          astroMobile: astrologerData.mobileNumber,
          astrologerId: astrologerId,
          actualChargeUserChat: actualChargeUserChat,
          updateAdminCommission: AdminCommissionData.AdminCommissionData,
        };
        if (showUserData?.freeChatStatus == false) {
          socket.emit("chat-timeLeft-update", newUserDetail);
          console.log("newUserDetail=====", newUserDetail);
        }

        // Update AstrologerNotificationStatus in secureLocalStorage and state
        secureLocalStorage.setItem(
          "AstrologerNotificationStatus",
          updatedAstrologerData.chatStatus
        );
        setAstrologerNotificationStatus(updatedAstrologerData.chatStatus);

        console.log("Astrologer status updated:", updatedAstrologerData);
      }
      // update order history
      const updateList = await axios.put(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/userId-to-astrologer-astro-list-update`,
        {
          mobileNumber: astrologerData.mobileNumber,
          chatStatus: false,
          profileStatus: true,
        }
      );
      console.log("update hist", updateList);
    } catch (error) {
      console.error(
        "Failed to update astrologer status:",
        error.response?.data?.error || error.message
      );
    }
  };

  useEffect(() => {
    if (astrologerNotificationStatus == undefined) {
      return;
    }

    if (
      astrologerNotificationStatus === "true" ||
      astrologerNotificationStatus === true
    ) {
      timeoutRef.current = setTimeout(() => {
        intervalRef.current = setInterval(() => {
          setTimeLeft((prevTime) => {
            const newTime = prevTime + 1;
            secureLocalStorage.setItem("chatTimeLeft", newTime.toString());
            secureLocalStorage.setItem("totalChatTime", newTime.toString());
            return newTime;
          });
        }, 1000);

        return () => {
          clearTimeout(timeoutRef.current);
          clearInterval(intervalRef.current);
          console.log("Timer cleared");
        };
      }, 100);
    } else {
      setTimeLeft(null);
      secureLocalStorage.removeItem("chatTimeLeft");
      clearTimeout(timeoutRef.current);
      clearInterval(intervalRef.current);
      const newUserDetail = {
        userId: userIds,
        totalChatTime: 0,
      };
      socket.emit("chat-timeLeft-update", newUserDetail);
      console.log("not working this", newUserDetail);
    }
  }, [astrologerNotificationStatus]);

  // if user balance is over then cut the automatic call start
  let userTotalAmount = showUserData?.totalAmount;
  let astroChatPricePerMinute = Math.round(astrologerData.charges);
  let totalTimeSecond = (userTotalAmount / astroChatPricePerMinute) * 60;

  useEffect(() => {
    if (totalChatTime > 0 && showUserData?.freeChatStatus == false) {
      const maxAffordableTime = Math.floor(
        (userTotalAmount / astroChatPricePerMinute) * 60 - 1
      );

      if (totalChatTime >= maxAffordableTime) {
        const remainingBalance = 0;
        console.log(totalChatTime, userTotalAmount, maxAffordableTime);
        setActualChargeUserChat(userTotalAmount);

        endChatStatus();
        console.log("Automatically ending chat due to balance exhaustion...");
      }
    }
  }, [totalChatTime, userTotalAmount, astroChatPricePerMinute]);
  // if user balance is over then cut the automatic call End

  const intervals = Math.ceil(totalChatTime / 60);
  const totalChatPrice = Math.min(intervals * astroChatPricePerMinute);
  const remainingBalance = userTotalAmount - totalChatPrice;

  const handleEndChatClick = () => {
    setActualChargeUserChat(totalChatPrice);
    setShowEndChat(true);
  };

  //  useEffect(()=>{
  //    setActualChargeUserChat(totalChatPrice);
  //  },[totalChatPrice])

  useEffect(() => {
    const className = "rating-popup-opened";

    if (showRating) {
      document.body.classList.add(className);
    } else {
      document.body.classList.remove(className);
    }

    return () => {
      document.body.classList.remove(className);
    };
  }, [showRating]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <>
      {showEndChat && (
        <EndChatPopUp
          setShowEndChat={setShowEndChat}
          onCloseEndChat={endChatStatus} // pass function, not result
          setShowRating={setShowRating}
        />
      )}

      {showRating && (
        <RatingPopUp
          userId={userIds}
          astrologerId={astrologerId}
          setShowRating={setShowRating}
          showUserData={showUserData}
        />
      )}

      <section className="chat-top-header">
        <div className="container">
          <div className="chat-top-header-main">
            <div className="inner-chat-top-header ctm-flex-row ctm-justify-content-between ctm-align-items-center">
              <div className="chat-left-logo ctm-flex-row ctm-align-items-center">
                <div className="header-chat-logo">
                  <a href="#" title="header-logo">
                    <img src={`${astrologerData.profileImage}`} alt="Chat" />
                  </a>
                </div>
                <div className="header-chat-content">
                  <h4>Astrologer</h4>
                  <p>
                    <span>
                      Balance {minutes}:{seconds < 10 ? `0${seconds}` : seconds}{" "}
                    </span>
                  </p>
                  {/* <p>Chat in progress from </p> */}
                  <h2>{astrologerData.name}</h2>
                </div>
              </div>
              <div className="chat-right-end-btn">
                <button onClick={handleEndChatClick}>End</button>
              </div>
            </div>

            <div
              ref={chatContainerRef}
              className="uder-and-astro-chat-bg chat-container"
            >
              <div className="inner-uder-and-astro-chat">
                <div className="chat-box">
                  {messageData.map((msg, index) => (
                    <div
                      key={index}
                      className={`
                     ${
                       msg.user === showUserData?.name
                         ? "message outgoing"
                         : "message incoming"
                     }`}
                    >
                      {/* <h4>{msg.user}</h4> */}
                      <p
                        className="chat-message"
                        dangerouslySetInnerHTML={{ __html: msg.message }}
                      ></p>
                      <p>{msg.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {timeLeft ? (
              <div className="send-input-button ctm-flex-row ctm-align-items-center ctm-justify-content-between">
                <div className="chat-input-box-main ctm-flex-row ctm-align-items-center ctm-justify-content-between">
                  <div className="chat-input">
                    <input
                      type="text"
                      placeholder="Type a message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <button onClick={sendMessage}>Send</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="send-input-button">
                {showUserData?.totalAmount == 0 ? (
                  <div className="extra-message-box">
                    <div className="chat-popup-container">
                      <div className="chat-popup-header">
                        <div className="image">
                          <img src="" alt="" />
                        </div>
                        <div className="text">
                          {" "}
                          Hi {showUserData?.name}, lets continue this chat at
                          price of ₹ {astrologerData?.charges}.0/min{" "}
                        </div>
                      </div>
                      <div className="chat-popup-footer">
                        <Link href="/add-wallet-money/price-list">
                          Continue
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="chat-end-text">
                    You have exhausted your chat time!
                  </div>
                )}
                {/* <Link href="#">Continue Chat</Link> */}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
