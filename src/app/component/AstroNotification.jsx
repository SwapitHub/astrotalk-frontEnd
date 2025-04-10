"use client";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_WEBSITE_URL, {
  transports: ["websocket"],
  reconnection: true,
});

const AstroNotification = () => {
  const [astrologerPhone, setAstrologerPhone] = useState(
    localStorage.getItem("astrologer-phone")
  );
  const [updateNotification, setUpdateNotification] = useState(null);

  const matchAstrologerMobile =
  astrologerPhone === updateNotification?.mobileNumber;

  useEffect(() => {
    const storedNotification = localStorage.getItem("new-notification");
    if (storedNotification) {
      setUpdateNotification(JSON.parse(storedNotification));
    }
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to socket.io server");
    });
  
    socket.on("new-notification", (data) => {
      if (astrologerPhone === data?.mobileNumber) {
        localStorage.setItem("new-notification", JSON.stringify(data));
        setUpdateNotification(data);
      }
    });
  
    return () => {
      socket.off("new-notification");
      socket.disconnect();
    };
  }, []);

  // console.log("==============",employeesData[0].chatStartTimeStatus);

  const onChangeId = async (astrologerId, userId) => {
    localStorage.setItem("userIds", userId);
    localStorage.setItem("astrologerId", astrologerId);

    try {
      // await router.push(`/chat-with-astrologer/astrologer/${astrologerId}`);

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/update-astro-status-by-mobile/${astrologerPhone}`,
        {
          chatStatus: true,
        }
      );

      if (response.data.message === "Success") {
        const astrologerData = response.data.updatedProfile;
        socket.emit("astrologer-chat-status", astrologerData);

        setUpdateNotification(null);
        localStorage.removeItem("new-notification");
        if(astrologerData.mobileNumber==astrologerPhone){
          localStorage.setItem(
            "AstrologerNotificationStatus",
            astrologerData.chatStatus
          );
        }
       

        // setTimeout(() => {
        //   window.location.reload();
        // }, 300);
      }

      // update order history page api
      const updateList = await axios.put(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/userId-to-astrologer-astro-list-update`,
        {
          mobileNumber: astrologerPhone,
          chatStatus: true
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

  const UpdateRemoveData = () => {
    localStorage.removeItem("new-notification");
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
