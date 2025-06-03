"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import io from "socket.io-client";

// Initialize socket connection
const socket = io(process.env.NEXT_PUBLIC_WEBSITE_URL, {
  transports: ["websocket"],
  reconnection: true,
});

const AstroNotification = ({ astrologerPhone, astroDetailData }) => {
  const [updateNotification, setUpdateNotification] = useState();
  const [updateRequestStatus, setUpdateRequestStatus] = useState();
  const [orderCounter, setOrderCounter] = useState(1);

  const [newRequestNotification, setNewRequestNotification] = useState(
    secureLocalStorage.getItem("requestStatusNotifications")
  );
  const [freeRequestNotification, setFreeRequestNotification] = useState(
    secureLocalStorage.getItem("requestFreeNotifications")
  );
  const [loading, setLoading] = useState(false);
  console.log("freeRequestNotification====", freeRequestNotification);

  useEffect(() => {
    const shouldReset = newRequestNotification == 1;

    if (shouldReset) {
      secureLocalStorage.setItem("IsLoadingRequestStore", false);
      setUpdateNotification(null);
      secureLocalStorage.removeItem("requestFreeNotifications")
    }
  }, [newRequestNotification]);

  useEffect(() => {
    const shouldReset = freeRequestNotification == "freeChatRemove";

    if (shouldReset) {
      secureLocalStorage.setItem("IsLoadingRequestStore", false);
      setUpdateNotification(null);
      secureLocalStorage.removeItem("new-notification-store");
      secureLocalStorage.removeItem("requestFreeNotifications")

    }
  }, [freeRequestNotification]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const freeChatResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}/astrologer-businessProfile/free-chat-true`
        );

        const astrologers = freeChatResponse.data.data;
        setUpdateRequestStatus(astrologers);
      } catch (error) {
        console.error("Error fetching free chat astrologers:", error);
      }
    };

    fetchData();
  }, []);

  // Fetch and set initial notification data from secureLocalStorage
  useEffect(() => {
    const storedNotification = secureLocalStorage.getItem(
      "new-notification-store"
    );
    if (storedNotification) {
      setUpdateNotification(JSON.parse(storedNotification));
    }
  }, []);

  // Socket connection and event listeners
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to socket.io server");
    });

    socket.on("new-notification", (data) => {
      console.log("new-notification received:", data); // Log the received data for debugging

      // Ensure the notification is for the correct astrologer
      if (data?.mobileNumber && astrologerPhone === data.mobileNumber) {
        secureLocalStorage.setItem(
          "new-notification-store",
          JSON.stringify(data)
        );
        console.log("========--------sasssssssss", data);

        setUpdateNotification(data);
        setUpdateRequestStatus((prev) =>
          prev.map((item) => ({
            ...item,
            requestStatus: data.requestStatus,
          }))
        );
      } else {
        console.warn(
          "Notification data does not match astrologer phone number"
        );
      }
    });

    // Clean up when component unmounts or astrologerPhone changes
    return () => {
      socket.off("new-notification");
    };
  }, [astrologerPhone]); // Ensure useEffect runs when astrologerPhone changes

  // Handle the update and status change of the astrologer
  const onChangeId = async (astrologerId, userId) => {
    localStorage.setItem("userIds", userId);
    secureLocalStorage.setItem("astrologerId", astrologerId);

    try {
      // await router.push(`/chat-with-astrologer/astrologer/${astrologerId}`);

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/update-astro-status-by-mobile/${astrologerPhone}`,
        {
          chatStatus: true,
          requestStatus: false,
        }
      );
      secureLocalStorage.removeItem("storedNotification");

      if (response.status == 200) {
        setUpdateNotification(null);
        secureLocalStorage.removeItem("storedNotification");

        const astrologerData = response.data.updatedProfile;
        socket.emit("astrologer-chat-status", astrologerData);
        if (freeRequestNotification === "freeChat") {
          socket.emit("astrologer-chat-request-FreeChat", {
            requestStatus: "freeChatRemove",
          });

        } else {
          socket.emit("astrologer-chat-requestPaidChat", { requestStatus: 1 });
        }
        // socket.emit("astrologer-chat-requestPaidChat", { requestStatus: 1 });
        secureLocalStorage.setItem("IsLoadingRequestStore", false);

        setUpdateNotification(null);
        secureLocalStorage.removeItem("new-notification-store");
          secureLocalStorage.removeItem("requestFreeNotifications");

        if (astrologerData.mobileNumber == astrologerPhone) {
          secureLocalStorage.setItem(
            "AstrologerNotificationStatus",
            astrologerData.chatStatus
          );
        }

        await axios.post(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}/profile-order`,
          {
            userId,
            astrologerId,
            userName: updateNotification.userName,
            order: orderCounter,
          }
        );

        for (const item of updateRequestStatus) {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_WEBSITE_URL}/update-business-profile/${item.mobileNumber}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                requestStatus: false,
              }),
            }
          );

          const result = await response.json();
          if (result.message == "Success") {
            setUpdateRequestStatus((prev) =>
              prev.map((astro) =>
                astro.mobileNumber === item.mobileNumber
                  ? { ...astro, requestStatus: false }
                  : astro
              )
            );
          }
        }
      }
    } catch (error) {
      console.error(
        "Failed to update astrologer status:",
        error.response?.data?.error || error.message
      );
    }
  };

  // Clear notification data from secureLocalStorage
  const UpdateRemoveData = () => {
    secureLocalStorage.setItem("IsLoadingRequestStore", false);

    if (freeRequestNotification === "freeChat") {
      socket.emit("astrologer-chat-request-FreeChat", {
        requestStatus: "",
      });

      secureLocalStorage.removeItem("requestFreeNotifications");
    } else {
      socket.emit("astrologer-chat-requestPaidChat", {
        requestStatus: 3,
      });
    }

    setUpdateNotification(null);
    secureLocalStorage.removeItem("new-notification-store");
  };

  useEffect(() => {
    if (newRequestNotification == "2" && newRequestNotification !== false) {
      // window.location.reload();
      socket.emit("astrologer-chat-requestPaidChat", { requestStatus: 3 });
      secureLocalStorage.removeItem("new-notification-store");
      setUpdateNotification(null);
    }
  }, [newRequestNotification]);

  useEffect(() => {
    const handleNotification = (data) => {
      if (data?.requestStatusData?.requestStatus) {
        console.log("📩 astrologer-requestStatus-new-notification:", data);
        setNewRequestNotification(data.requestStatusData.requestStatus);
        secureLocalStorage.setItem(
          "requestStatusNotifications",
          data.requestStatusData.requestStatus
        );
      } else if (data?.requestStatusFreeChat?.requestStatus) {
        console.log("📩 astrologer-request-FreeChat-new-notification:", data);
        setFreeRequestNotification(data.requestStatusFreeChat.requestStatus);
        secureLocalStorage.setItem(
          "requestFreeNotifications",
          data.requestStatusFreeChat.requestStatus
        );
      }
    };

    // Add listeners
    socket.on("astrologer-requestStatus-new-notification", handleNotification);
    socket.on(
      "astrologer-requestPaidChat-new-notification",
      handleNotification
    );
    socket.on(
      "astrologer-request-FreeChat-new-notification",
      handleNotification
    );

    // Clean up on unmount
    return () => {
      socket.off(
        "astrologer-requestStatus-new-notification",
        handleNotification
      );
      socket.off(
        "astrologer-requestPaidChat-new-notification",
        handleNotification
      );
      socket.off(
        "astrologer-request-FreeChat-new-notification",
        handleNotification
      );
    };
  }, []);

  const updateNotificationSingleChat =
    updateNotification && updateNotification?.mobileNumber;

  useEffect(() => {
    const shouldShow =
      newRequestNotification === 0 && updateNotificationSingleChat;

    secureLocalStorage.setItem("shouldShowNotification", shouldShow);
  }, [newRequestNotification, updateNotificationSingleChat]);

  return (
    <>
      {updateNotification?.mobileNumber && (
        <div className="notification-astro">
          <div className="notification-box">
            <h4>New Chat Request</h4>
            <p>
              <strong>Name of User:</strong> {updateNotification?.userName}
            </p>
            <p>
              <strong>Date of Birth:</strong>{" "}
              {updateNotification?.userDateOfBirth}
            </p>
            <p>
              <strong>Place of Birth:</strong>{" "}
              {updateNotification?.userPlaceOfBorn}
            </p>
            <p>
              <strong>Time of Birth:</strong> {updateNotification?.userBornTime}
            </p>
            <div className="button-outer">
              <button onClick={UpdateRemoveData}>Dismiss</button>
              <a
                href={`/chat-with-astrologer/astrologer/${updateNotification?.astrologerId}`}
                // href="#"
                onClick={() =>
                  onChangeId(
                    updateNotification.astrologerId,
                    updateNotification.userId
                  )
                }
              >
                Chat
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AstroNotification;
