"use client";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRef } from "react";
import secureLocalStorage from "react-secure-storage";
import EndChatPopUp from "@/app/component/EndChatPopUp";
import { useRouter } from "next/navigation";

const socket = io(process.env.NEXT_PUBLIC_WEBSITE_URL, {
  transports: ["websocket"],
  reconnection: true,
});

export default function Chatting({ astrologer, AdminCommissionData }) {
  const router = useRouter();
  // const astrologerPhone = localStorage.getItem("astrologer-phone");
  // const totalChatTime = Math.round(localStorage.getItem("totalChatTime"));
  // State declarations
  const [timeLeft, setTimeLeft] = useState(null);
  const [showRating, setShowRating] = useState(false);
  const [actualChargeUserChat, setActualChargeUserChat] = useState();
  const [showEndChat, setShowEndChat] = useState(false);
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);
  const [message, setMessage] = useState("");
  const [astrologerData, setAstrologerData] = useState("");
  const [messageData, setMessageData] = useState([]);
  const [user, setUser] = useState("");
  const [showUserData, setShowUserData] = useState("");

  const [astrologerPhone, setAstrologerPhone] = useState("");
  const [totalChatTime, setTotalChatTime] = useState();
  const [astrologerId, setAstrologerId] = useState("");
  const [userIds, setUserIds] = useState("");
  const [astrologerNotificationStatus, setAstrologerNotificationStatus] =
    useState("");
  const [isTyping, setIsTyping] = useState(false);

  const chatContainerRef = useRef(null);

  // Load localStorage on mount
  useEffect(() => {
    setAstrologerPhone(localStorage.getItem("astrologer-phone") || "");
    setTotalChatTime(Math.round(localStorage.getItem("totalChatTime")));
    setAstrologerId(localStorage.getItem("astrologerId") || "");
    setUserIds(localStorage.getItem("userIds") || "");
    setAstrologerNotificationStatus(
      localStorage.getItem("AstrologerNotificationStatus") || ""
    );
  }, []);

  useEffect(() => {
    // if (!astrologerNotificationStatus) return;
    if (
      astrologerNotificationStatus === false ||
      astrologerNotificationStatus === undefined
    ) {
      router.push("/");
    }
  }, [astrologerNotificationStatus]);

  // Typing socket event
  useEffect(() => {
    if (!socket) return;

    const handleTyping = (data) => {
      if (data.userId !== userIds) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 2000);
      }
    };

    socket.on("typing", handleTyping);
    return () => socket.off("typing", handleTyping);
  }, [userIds]);

  const handleTyping = () => {
    if (!astrologerId) return;
    socket.emit("typing", {
      sender: showUserData?._id,
      receiverId: astrologerId,
    });
  };

  useEffect(() => {
    const storedTime = localStorage.getItem("chatTimeLeft");
    if (storedTime) setTimeLeft(parseInt(storedTime, 10));
    else if (
      astrologerNotificationStatus === "false" ||
      astrologerNotificationStatus === false
    )
      setTimeLeft(0);
    else setTimeLeft(null);
  }, [astrologerNotificationStatus]);

  // Initial data socket listener
  useEffect(() => {
    if (!astrologerPhone) return;

    socket.on("connect", () => console.log("Connected to socket.io server"));

    socket.on("astrologer-data-received-new-notification", (data) => {
      if (data.astrologerData.mobileNumber === astrologerPhone) {
        localStorage.setItem(
          "AstrologerNotificationStatus",
          data.astrologerData.chatStatus
        );
        setAstrologerNotificationStatus(data.astrologerData.chatStatus);
      }
    });

    return () => {
      socket.off("astrologer-data-received-new-notification");
      socket.disconnect();
    };
  }, [astrologerPhone]);

  useEffect(() => {
    if (!userIds) return;
    axios
      .get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/user-login-detail/${userIds}`
      )
      .then((response) => setShowUserData(response.data.data))
      .catch(console.error);
  }, [userIds]);

  useEffect(() => {
    if (!astrologerPhone) return;
    axios
      .get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/astrologer-businessProfile/${astrologerPhone}`
      )
      .then((response) => setAstrologerData(response.data))
      .catch(console.error);
  }, [astrologerPhone]);

  // Message fetch
  const fetchMessages = async () => {
    if (!astrologerId || !userIds) return;
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/chat/detail/${userIds}/${astrologerId}`
      );
      setMessageData(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Scroll bottom when new message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [message]);

  // Auto send message first time
  useEffect(() => {
    if (!user || !userIds || !astrologerId) return;
    const now = new Date();
    const time = `${now.getHours() % 12 || 12}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")} ${now.getHours() >= 12 ? "PM" : "AM"}`;
    const newMessage = {
      user: user,
      message: `Hi,<br/><br/>Below are Your details:<br/>Name: ${
        showUserData?.name
      }<br/>Gender: ${showUserData?.gender}<br/>DOB: ${
        showUserData?.dateOfBirth
      }<br/>${
        showUserData?.reUseDateOfBirth
          ? `TOB: ${showUserData?.reUseDateOfBirth}<br/>`
          : ""
      }POB: ${showUserData?.placeOfBorn}<br/>`,
      time: time,
      members: [userIds, astrologerId],
    };
    socket.emit("sendMessage", newMessage);
  }, [userIds, astrologerId, showUserData]);

  const sendMessage = () => {
    if (!message.trim() || !astrologerId || !userIds) return;
    const now = new Date();
    const time = `${now.getHours() % 12 || 12}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")} ${now.getHours() >= 12 ? "PM" : "AM"}`;
    const newMessage = {
      user: user,
      message: message,
      time: time,
      members: [userIds, astrologerId],
    };
    socket.emit("sendMessage", newMessage);
    setMessage("");
    scrollToBottom();
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    if (!astrologerId || !userIds) return;
    setUser(astrologer.name);
    socket.emit("joinChat", { userIds, astrologerId });
    fetchMessages();
    socket.on("receiveMessage", (msg) =>
      setMessageData((prev) => [...prev, msg])
    );
    return () => socket.off("receiveMessage");
  }, [userIds, astrologerId]);

  const endChatStatus = async () => {
    if (actualChargeUserChat === undefined) return;
    if (showUserData?.freeChatStatus || showUserData?.chatStatus) {
      await axios.put(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/update-user/${showUserData?.phone}`,
        {
          freeChatStatus: false,
          chatStatus: false,
        }
      );
    }

    if (
      astrologerNotificationStatus === "false" ||
      astrologerNotificationStatus === false
    )
      return;

    clearTimeout(timeoutRef.current);
    clearInterval(intervalRef.current);

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/update-astro-status-by-mobile/${astrologerData.mobileNumber}`,
        { chatStatus: false }
      );

      if (response.data.message === "Success") {
        toast.error("End Chat Successfully", { position: "top-right" });
        setTimeLeft(null);
        localStorage.removeItem("chatTimeLeft");
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
          updateAdminCommission: AdminCommissionData,
        };

        if (showUserData?.freeChatStatus === false) {
          socket.emit("chat-timeLeft-update", newUserDetail);
        }

        localStorage.setItem(
          "AstrologerNotificationStatus",
          updatedAstrologerData.chatStatus
        );
        setAstrologerNotificationStatus(updatedAstrologerData.chatStatus);

        await axios.put(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}/userId-to-astrologer-astro-list-update`,
          {
            mobileNumber: astrologerData.mobileNumber,
            chatStatus: false,
            profileStatus: true,
          }
        );
      }
    } catch (error) {
      console.error("Failed to update astrologer status:", error);
    }
  };

  useEffect(() => {
    if (
      astrologerNotificationStatus === "true" ||
      astrologerNotificationStatus === true
    ) {
      timeoutRef.current = setTimeout(() => {
        intervalRef.current = setInterval(() => {
          setTimeLeft((prevTime) => {
            const newTime = prevTime + 1;
            localStorage.setItem("chatTimeLeft", newTime.toString());
            localStorage.setItem("totalChatTime", newTime.toString());
            return newTime;
          });
        }, 1000);
      }, 100);
    } else {
      setTimeLeft(null);
      // localStorage.removeItem("chatTimeLeft");
      clearTimeout(timeoutRef.current);
      clearInterval(intervalRef.current);
      socket.emit("chat-timeLeft-update", {
        userId: userIds,
        totalChatTime: 0,
      });
    }
  }, [astrologerNotificationStatus]);

  const userTotalAmount = showUserData?.totalAmount;
  const astroChatPricePerMinute = Math.round(astrologerData.charges);
  const totalTimeSecond = (userTotalAmount / astroChatPricePerMinute) * 60;

  useEffect(() => {
    if (totalChatTime > 0 && showUserData?.freeChatStatus === false) {
      const maxAffordableTime = Math.floor(totalTimeSecond - 1);
      if (totalChatTime >= maxAffordableTime) {
        setActualChargeUserChat(userTotalAmount);
        endChatStatus();
      }
    }
  }, [totalChatTime, userTotalAmount, astroChatPricePerMinute]);

  const intervals = Math.ceil(totalChatTime / 60);
  const totalChatPrice = Math.min(intervals * astroChatPricePerMinute);
  const remainingBalance = userTotalAmount - totalChatPrice;

  const handleEndChatClick = () => {
    setActualChargeUserChat(totalChatPrice);
    setShowEndChat(true);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  return (
    <>
      {showEndChat && (
        <EndChatPopUp
          setShowEndChat={setShowEndChat}
          onCloseEndChat={endChatStatus}
          setShowRating={setShowRating}
        />
      )}

      <section className="chat-top-header astrologer-chat">
        <div className="container">
          <div className="chat-top-header-main">
            <div className="inner-chat-top-header ctm-flex-row ctm-justify-content-between ctm-align-items-center">
              <div className="chat-left-logo ctm-flex-row ctm-align-items-center">
                <div className="header-chat-logo">
                  <a href="#" title="header-logo">
                    <img src="/user-profile-icon.jpg" alt="Chat" />
                  </a>
                </div>
                <div className="header-chat-content">
                  <h4>User</h4>
                  <p>
                    <span>
                      Balance {minutes}:{seconds < 10 ? `0${seconds}` : seconds}{" "}
                    </span>
                  </p>
                  {/* <p>Chat in progress from </p> */}
                  <h2>{showUserData?.name}</h2>
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
                      className={
                        msg.user === user
                          ? "message outgoing"
                          : "message incoming"
                      }
                    >
                      {/* <p>{msg.message}</p> */}
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
            {isTyping && <div className="typing-indicator">Typing...</div>}
            {timeLeft ? (
              <div className="send-input-button ctm-flex-row ctm-align-items-center ctm-justify-content-between">
                <div className="chat-input-box-main ctm-flex-row ctm-align-items-center ctm-justify-content-between">
                  <div className="chat-input">
                    <input
                      type="text"
                      placeholder="Type a message"
                      value={message}
                      // onChange={(e) => setMessage(e.target.value)}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        handleTyping();
                      }}
                      onKeyDown={handleKeyDown}
                    />
                    <button onClick={sendMessage}>Send</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="chat-end-text send-input-button">
                You have exhausted your chat time!
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
