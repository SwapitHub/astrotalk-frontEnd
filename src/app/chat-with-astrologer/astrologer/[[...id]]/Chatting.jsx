"use client";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRef } from "react";
import {
  fetchAstroProfileDetail,
  fetchUserLoginDetails,
} from "@/app/utils/api";

const socket = io(process.env.NEXT_PUBLIC_WEBSITE_URL, {
  transports: ["websocket"],
  reconnection: true,
});

export default function Chatting({ astrologer }) {
  const [actualChargeUserChat, setActualChargeUserChat] = useState();
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);
  const [message, setMessage] = useState("");
  const [astrologerData, setAstrologerData] = useState("");
  const [messageData, setMessageData] = useState([]);
  const [user, setUser] = useState("");
  const [astrologerNotificationStatus, setAstrologerNotificationStatus] =
    useState();
  const [showUserData, setShowUserData] = useState("");
  const [astrologerPhone, setAstrologerPhone] = useState();
  const [astrologerId, SetAstrologerId] = useState();
  const [userIds, SetUserIds] = useState();
  const [totalChatTime, setTotalChatTime] = useState();

  useEffect(() => {
    let storedNotification = localStorage.getItem(
      "AstrologerNotificationStatus"
    );
    const astrologerPhone = localStorage.getItem("astrologer-phone");
    const astrologerId = localStorage.getItem("astrologerId");
    const userIds = localStorage.getItem("userIds");
    const totalChatTime = Math.round(localStorage.getItem("totalChatTime"));

    if (storedNotification) {
      setAstrologerNotificationStatus(storedNotification);
    }
    setAstrologerPhone(astrologerPhone);
    SetAstrologerId(astrologerId);
    SetUserIds(userIds);
    setTotalChatTime(totalChatTime);
  }, []);

  const [timeLeft, setTimeLeft] = useState(() => {
    // Initialize timeLeft from localStorage or set to a default value
    const storedTime = localStorage.getItem("chatTimeLeft");
    return storedTime
      ? parseInt(storedTime, 10)
      : astrologerNotificationStatus == false
      ? 0
      : null;
  });

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to socket.io server");
    });

    socket.on("astrologer-data-received-new-notification", (data) => {
      console.log("New notification received:", data);
      if (data.astrologerData.mobileNumber == astrologerPhone) {
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
  }, []);

  const fetchDataUserDetail = async () => {
    try {
      const data = await fetchUserLoginDetails(userIds);
      setShowUserData(data);
    } catch (error) {
      console.error("Error fetching fetchDataUserDetail:", error);
    }
  };
  useEffect(() => {
    fetchDataUserDetail();
  }, []);

  // useEffect(() => {
  //   axios
  //     .get(
  //       `${process.env.NEXT_PUBLIC_WEBSITE_URL}/astrologer-businessProfile/${astrologerPhone}`
  //     )
  //     .then((response) => {
  //       setAstrologerData(response.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAstroProfileDetail(astrologerPhone);
        setAstrologerData(data);
      } catch (error) {
        console.error("Failed to fetchAstroProfileDetail", error);
      }
    };

    fetchData();
  }, []);

  // message detail api
  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/chat/detail/${userIds}/${astrologerId}`
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
  }, [message]);
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
        user: user,
        message: message,
        time: time,
        members: [userIds, astrologerId],
      };
      // Emit the message to the server
      socket.emit("sendMessage", newMessage);
      setMessage("");
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
    setUser(astrologer?.name);
    socket.emit("joinChat", { userIds, astrologerId });
    fetchMessages();
    socket.on("receiveMessage", (msg) => {
      setMessageData((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receiveMessage"); // Remove the listener
      socket.disconnect();
    };
  }, []);

  const endChatStatus = async () => {
    if (actualChargeUserChat == undefined) return;
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
        toast.error("Call Rejected", {
          position: "top-right",
        });

        // Update state and localStorage
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
        };
        socket.emit("chat-timeLeft-update", newUserDetail);
        console.log(newUserDetail);

        // Update AstrologerNotificationStatus in localStorage and state
        localStorage.setItem(
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
        }
      );
      console.log(updateList);
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
            localStorage.setItem("chatTimeLeft", newTime.toString());
            localStorage.setItem("totalChatTime", newTime.toString());
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
      localStorage.removeItem("chatTimeLeft");
      clearTimeout(timeoutRef.current);
      clearInterval(intervalRef.current);
      const newUserDetail = {
        userId: userIds,
        totalChatTime: 0,
      };
      socket.emit("chat-timeLeft-update", newUserDetail);
      console.log("not working this");
    }
  }, [astrologerNotificationStatus]);

  // if user balance is over then cut the automatic call start
  let userTotalAmount = showUserData?.totalAmount;
  let astroChatPricePerMinute = Math.round(astrologerData.charges);
  let totalTimeSecond = (userTotalAmount / astroChatPricePerMinute) * 60;
  console.log(totalChatTime);

  useEffect(() => {
    if (totalChatTime > 0) {
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
    endChatStatus();
  };

  // useEffect(()=>{
  //   setActualChargeUserChat(totalChatPrice);
  // },[totalChatPrice])

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  return (
    <section className="chat-top-header">
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
                    <p>{msg.message}</p>
                    <p>{msg.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {timeLeft !== 0 ? (
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
            <div>
              please recharge then continue chatting{" "}
              <Link href="#">Continue Chat</Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
