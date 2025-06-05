"use client"
import React from 'react'
import { useEffect } from 'react';
import secureLocalStorage from 'react-secure-storage';
import io from "socket.io-client";
const socket = io(`${process.env.NEXT_PUBLIC_WEBSITE_URL}`);

const ChatButtonUser = ({item, userAmount, userIds}) => {
    
      const onChangeId = async (
        astrologerId,
        mobileNumber,
        profileImage,
        astroName,
        astroCharge,
        astroExperience
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
            };
    
            socket.emit("userId-to-astrologer", messageId);
          } catch (error) {
            console.error("Navigation failed:", error);
          }
        } else {
          setShowRecharge(true);
          setAstroMobileNum(mobileNumber);
        }
      };
    
      useEffect(() => {
        // Listen for success event from the server
        socket.on("userId-to-astrologer-success", (data) => {
          // console.log("userId and astrologerId saved successfully:", data);
        });
    
        // Listen for error event from the server
        socket.on("userId-to-astrologer-error", (error) => {
          console.error("Error saving userId and astrologerId:", error);
          // You can update the UI or show an error message here
        });
    
        return () => {
          // Clean up event listeners
          socket.off("userId-to-astrologer-success");
          socket.off("userId-to-astrologer-error");
        };
      }, []);
  return (
    <>
    {item.chatStatus == false ? (
        <div className="astrologer-call-button-ctm">
          {userAmount >= item.charges * 2 ? (
            <a
              href={`/chat-with-astrologer/user/${userIds}`}
              onClick={() =>
                onChangeId(
                  item._id,
                  item.mobileNumber,
                  item.profileImage,
                  item.name,
                  item.charges,
                  item.experience
                )
              }
            >
              Chat{" "}
            </a>
          ) : (
            <button
              onClick={() =>
                onChangeId(
                  item._id,
                  item.mobileNumber,
                  item.profileImage,
                  item.name,
                  item.charges,
                  item.experience
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
          <span>waiting 5 minutes</span>
        </div>
      )}
      </>
  )
}

export default ChatButtonUser