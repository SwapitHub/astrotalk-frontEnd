"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import io from "socket.io-client";

// Initialize socket connection
const socket = io(process.env.NEXT_PUBLIC_WEBSITE_URL, {
  transports: ["websocket"],
  reconnection: true,
});

const AstroNotification = ({ astrologerPhone }) => {
  const [updateNotification, setUpdateNotification] = useState();
  const [updateRequestStatus, setUpdateRequestStatus] = useState();
  const [orderCounter, setOrderCounter] = useState(1);
  console.log(orderCounter);

  const [newRequestNotification, setNewRequestNotification] = useState(
    secureLocalStorage.getItem("requestStatusNotifications")
  );
  const [loading, setLoading] = useState(false);
  console.log("newRequestNotification", newRequestNotification);

  console.log(updateRequestStatus);
  console.log(updateNotification);

  const matchAstrologerMobile =
    astrologerPhone === updateNotification?.mobileNumber;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const freeChatResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}/astrologer-businessProfile/free-chat-true`
        );

        const astrologers = freeChatResponse.data.data;
        setUpdateRequestStatus(astrologers);
        console.log("astrologers===========", astrologers);
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
    secureLocalStorage.setItem("userIds", userId);
    secureLocalStorage.setItem("astrologerId", astrologerId);

    try {


      await axios.post(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/profile-order`,
        {
          userId,
          astrologerId,
          userName: updateNotification.userName,
          order: orderCounter,
        }
      );
      // await router.push(`/chat-with-astrologer/astrologer/${astrologerId}`);

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/update-astro-status-by-mobile/${astrologerPhone}`,
        {
          chatStatus: true,
          requestStatus: false,
        }
      );
      console.log(response);
      secureLocalStorage.removeItem("new-notification-store");

      if (response.status == 200) {
        console.log(response.status == 200);
        setUpdateNotification(null);
        secureLocalStorage.removeItem("new-notification-store");
        const astrologerData = response.data.updatedProfile;
        socket.emit("astrologer-chat-status", astrologerData);
        socket.emit("astrologer-chat-requestStatus", { requestStatus: false });
        socket.emit("astrologer-chat-requestPaidChat", { requestStatus: 1 });

        if (astrologerData.mobileNumber == astrologerPhone) {
          console.log(astrologerData.chatStatus);

          secureLocalStorage.setItem(
            "AstrologerNotificationStatus",
            astrologerData.chatStatus
          );
        }

      


        for (const item of updateRequestStatus) {
          console.log(item);

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
          console.log("Updated:", item.mobileNumber, result);
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
    socket.emit("astrologer-chat-requestStatus", { requestStatus: false });
    socket.emit("astrologer-chat-requestPaidChat", { requestStatus: 1 });
    secureLocalStorage.setItem("IsLoadingRequestStore", false);
    secureLocalStorage.removeItem("new-notification-store");
    setUpdateNotification(null);
  };

  useEffect(() => {
    const handleNewRequestStatusNotification = (data) => {
      console.log("📩 astrologer-requestStatus-new-notification:", data);

      setNewRequestNotification(data.requestStatusData?.requestStatus);
      // Optionally save to secureLocalStorage if needed
      secureLocalStorage.setItem(
        "requestStatusNotifications",
        data.requestStatusData?.requestStatus
      );
    };

    // Add listeners
    socket.on(
      "astrologer-requestStatus-new-notification",
      handleNewRequestStatusNotification
    );
    socket.on(
      "astrologer-requestPaidChat-new-notification",
      handleNewRequestStatusNotification
    );

    // Clean up both listeners on unmount
    return () => {
      socket.off(
        "astrologer-requestStatus-new-notification",
        handleNewRequestStatusNotification
      );
      socket.off(
        "astrologer-requestPaidChat-new-notification",
        handleNewRequestStatusNotification
      );
    };
  }, []);

  const updateNotificationFreeChat =
    updateRequestStatus?.some((item) => item.requestStatus === true) &&
    (newRequestNotification === true || newRequestNotification === undefined);

  const updateNotificationSingleChat =
    updateNotification && matchAstrologerMobile;
  console.log("matchAstrologerMobile", matchAstrologerMobile);

  console.log(
    "updateNotificationFreeChat",
    updateNotificationFreeChat,
    updateNotificationSingleChat
  );

  const shouldShowNotification =
    (newRequestNotification === true && updateNotificationFreeChat) ||
    (newRequestNotification === 0 && updateNotificationSingleChat);

  return (
    <>
      {shouldShowNotification && (
        <div className="notification-astro">
          <div className="notification-box">
            <h4>New Chat Request</h4>
            <p>
              <strong>Name of User:</strong> {updateNotification.userName}
            </p>
            <p>
              <strong>Date of Birth:</strong>{" "}
              {updateNotification.userDateOfBirth}
            </p>
            <p>
              <strong>Place of Birth:</strong>{" "}
              {updateNotification.userPlaceOfBorn}
            </p>
            <p>
              <strong>Time of Birth:</strong> {updateNotification.userBornTime}
            </p>
            <button onClick={UpdateRemoveData}>Dismiss</button>
            <a
              href={`/chat-with-astrologer/astrologer/${updateNotification.astrologerId}`}
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
      )}
    </>
  );
};

export default AstroNotification;
