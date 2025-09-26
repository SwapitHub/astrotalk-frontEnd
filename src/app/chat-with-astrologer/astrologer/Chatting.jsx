"use client";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRef } from "react";
import secureLocalStorage from "react-secure-storage";
import EndChatPopUp from "@/app/component/EndChatPopUp";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";

const socket = io(process.env.NEXT_PUBLIC_BASE_URL, {
  path: "/api/socket.io",
  transports: ["websocket"],
  withCredentials: true,
});


export default function Chatting({ astrologer, AdminCommissionData }) {
  const router = useRouter();
      const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const chatAstro_1 = segments[0];
  const chatAstro_2 = segments[1];
  console.log(astrologer,"astrologer");
  
  const astrologerPhone = Cookies.get("astrologer-phone");
  const totalChatTime = Math.round(secureLocalStorage.getItem("totalChatTime"));
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
  const astrologerId = Cookies.get("astrologerId");
  const userIds = Cookies.get("userIds");
  const [astrologerNotificationStatus, setAstrologerNotificationStatus] =
    useState(() => Cookies.get("AstrologerNotificationStatus"));

 
  console.log("pathname", chatAstro_1,chatAstro_2);

  useEffect(() => {
    if (
      astrologerNotificationStatus == false ||
      astrologerNotificationStatus == undefined
    ) {
      router.push("/astrologer");
    }
  }, [astrologerNotificationStatus]);

  // typing logic start here
  const [isTyping, setIsTyping] = useState(false);
  console.log(isTyping, "isTyping");

  useEffect(() => {
    if (!socket) return;

    const handleTyping = (data) => {
      if (data.userId !== userIds) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 2000);
      }
    };

    socket.on("typing", handleTyping);

    return () => {
      socket.off("typing", handleTyping);
    };
  }, [socket, userIds]);

  const handleTyping = () => {
    socket.emit("typing", {
      sender: showUserData?._id,
      receiverId: astrologerId,
    });
  };
  // typing logic end here

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
    socket.on("connect", () => {
      console.log("Connected to socket.io server");
    });

    socket.on("astrologer-data-received-new-notification", (data) => {
      console.log("New notification received:", data);
      if (data.astrologerData.mobileNumber == astrologerPhone) {
        Cookies.set(
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

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/user-login-detail/${userIds}`
      )
      .then((response) => {
        setShowUserData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  useEffect(() => {
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
  useEffect(() => {
    if (!user || !userIds || !astrologerId) return; // wait until all data is available
    const alreadySent = sessionStorage.getItem("userDetailsMessageSent");

    if (alreadySent === "true") return;

    const now = new Date();
    const hours = now.getHours() % 12 || 12;
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = now.getHours() >= 12 ? "PM" : "AM";
    const time = `${hours}:${minutes} ${ampm}`;

    const newMessage = {
      user: user,
      message: `Hi,<br/><br/>
Below are Your details:<br/>
Name: ${showUserData?.name}<br/>
Gender: ${showUserData?.gender}<br/>
DOB: ${showUserData?.dateOfBirth}<br/>
${
  showUserData?.reUseDateOfBirth
    ? `TOB: ${showUserData?.reUseDateOfBirth}<br/>`
    : ""
}
POB: ${showUserData?.placeOfBorn}<br/>`,
      time: time,
      members: [userIds, astrologerId],
    };

    socket.emit("sendMessage", newMessage);
    sessionStorage.setItem("userDetailsMessageSent", "true");
  }, [userIds, astrologerId, showUserData]); // only run once when all 3 are available

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
      console.log(newMessage);
      
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
console.log(astrologer, "astrologer.name");

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
  }, [userIds, astrologerId]);

  const endChatStatus = async () => {
    if (actualChargeUserChat == undefined) return;

    if (
      showUserData?.freeChatStatus == true ||
      showUserData?.chatStatus == true
    ) {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/update-user/${showUserData?.phone}`,
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
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/update-astro-status-by-mobile/${astrologerPhone}`,
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
          updateAdminCommission: AdminCommissionData,
        };
        // socket.emit("chat-timeLeft-update", newUserDetail);
        // console.log(newUserDetail);
        if (showUserData?.freeChatStatus == false) {
          socket.emit("chat-timeLeft-update", newUserDetail);
          console.log("newUserDetail=====", newUserDetail);
        }
        // Update AstrologerNotificationStatus in secureLocalStorage and state
        Cookies.set(
          "AstrologerNotificationStatus",
          updatedAstrologerData.chatStatus
        );
        setAstrologerNotificationStatus(updatedAstrologerData.chatStatus);

        console.log("Astrologer status updated:", updatedAstrologerData);

        console.log(astrologerData.mobileNumber);
        // update order history
        // const updateList = await axios.put(
        //   `${process.env.NEXT_PUBLIC_WEBSITE_URL}/userId-to-astrologer-astro-list-update`,
        //   {
        //     mobileNumber: astrologerData.mobileNumber,
        //     chatStatus: false,
        //     profileStatus: true,
        //   }
        // );

        // console.log("update hist", updateList);
      }
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
      console.log("not working this");
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
                      Duration: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}{" "}
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
