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
  const [loading, setLoading] = useState(false);

  console.log(astrologerPhone, updateNotification);

  const matchAstrologerMobile =
    astrologerPhone === updateNotification?.mobileNumber;

  // Fetch and set initial notification data from secureLocalStorage
  useEffect(() => {
    const storedNotification = secureLocalStorage.getItem("new-notification-store");
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
        secureLocalStorage.setItem("new-notification-store", JSON.stringify(data));
        setUpdateNotification(data);
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
      // await router.push(`/chat-with-astrologer/astrologer/${astrologerId}`);

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/update-astro-status-by-mobile/${astrologerPhone}`,
        {
          chatStatus: true,
        }
      );
      console.log(response.status);

      if (response.status == 200) {
        console.log(response.status == 200);
      secureLocalStorage.removeItem("new-notification-store");
        setUpdateNotification(null);
        const astrologerData = response.data.updatedProfile;
        socket.emit("astrologer-chat-status", astrologerData);        

        if (astrologerData.mobileNumber == astrologerPhone) {
          console.log(astrologerData.chatStatus);

          secureLocalStorage.setItem(
            "AstrologerNotificationStatus",
            astrologerData.chatStatus
          );
        }

        // setTimeout(() => {
        //   window.location.reload();
        // }, 300);
      }
      // update order history page api
      // const updateList = await axios.put(
      //   `${process.env.NEXT_PUBLIC_WEBSITE_URL}/userId-to-astrologer-astro-list-update`,
      //   {
      //     mobileNumber: astrologerPhone,
      //     chatStatus: true
      //   }
      // );
      // console.log("update order history",updateList);
    } catch (error) {
      console.error(
        "Failed to update astrologer status:",
        error.response?.data?.error || error.message
      );
    }
  };

  // Clear notification data from secureLocalStorage
  const UpdateRemoveData = () => {
    secureLocalStorage.removeItem("new-notification-store");
    setUpdateNotification(null);
  };

  return (
    <>
      {updateNotification && matchAstrologerMobile && (
        <div className="notification-astro">
          <div className="notification-box">
            <h4>New Chat Request</h4>
            <p>
              <strong>Name of User:</strong> {updateNotification.name}
            </p>
            <p>
              <strong>Date of Birth:</strong> {updateNotification.dateOfBirth}
            </p>
            <p>
              <strong>Place of Birth:</strong> {updateNotification.placeOfBirth}
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
