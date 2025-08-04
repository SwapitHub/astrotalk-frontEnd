"use client";
import Loader from "@/app/component/Loader";
import CustomHookCommission from "@/app/hook/CustomHookCommission";
import React from "react";

const ChatCommission = () => {
  const {
    data: chatCommission,
    loading: loadingChat,
    addCommission: addChatCommission,
    deleteCommission: deleteChatCommission,
  } = CustomHookCommission({
    fetchUrl: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/add-AdminCommission-astrologer`,
    addUrl: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/add-AdminCommission-astrologer`,
    deleteUrl: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/delete-AdminCommission-astrologer`,
    valueKey: "AdminCommissions",
  });

  const {
    data: pujaCommission,
    loading: loadingPuja,
    addCommission: addPujaCommission,
    deleteCommission: deletePujaCommission,
  } = CustomHookCommission({
    fetchUrl: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/add-AdminCommission-puja-astrologer`,
    addUrl: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/add-AdminCommission-puja-astrologer`,
    deleteUrl: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/delete-AdminCommission-puja-astrologer`,
    valueKey: "AdminCommissionsPuja",
  });

  const handleAddChat = () => {
    const val = document.getElementById("AdminCommission")?.value.trim();
    if (val) {
      addChatCommission(val);
      document.getElementById("AdminCommission").value = "";
    }
  };

  const handleAddPuja = () => {
    const val = document.getElementById("AdminCommissionPuja")?.value.trim();
    if (val) {
      addPujaCommission(val);
      document.getElementById("AdminCommissionPuja").value = "";
    }
  };

  return (
    <>
      <div className="AddAdminCommissions AddLanguage">
        <div className="language-add-data">
          <h2>Admin to Astrologer Chat Commission (Based on Percentage)</h2>
          <input
            type="number"
            placeholder="Admin Commission"
            id="AdminCommission"
          />
          <button
            disabled={chatCommission.length > 0}
            className={chatCommission.length > 0 ? "disable" : ""}
            onClick={handleAddChat}
          >
            Chat Commission
          </button>
        </div>

        <div className="language-list">
          <h2>Available Chat Commissions</h2>
          {loadingChat ? (
            <Loader />
          ) : (
            <ul>
              {chatCommission.map((item) => (
                <li key={item._id}>
                  {item.AdminCommissions} %
                  <button onClick={() => deleteChatCommission(item._id)}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="AddAdminCommissions-puja AddLanguage">
        <div className="language-add-data">
          <h2>Admin to Astrologer Puja Commission (Based on Percentage)</h2>
          <input
            type="number"
            placeholder="Admin Puja Commission"
            id="AdminCommissionPuja"
          />
          <button
            disabled={pujaCommission.length > 0}
            className={pujaCommission.length > 0 ? "disable" : ""}
            onClick={handleAddPuja}
          >
            Puja Commission
          </button>
        </div>

        <div className="language-list">
          <h2>Available Puja Commissions</h2>
          {loadingPuja ? (
            <Loader />
          ) : (
            <ul>
              {pujaCommission.map((item) => (
                <li key={item._id}>
                  {item.AdminCommissionsPuja} %
                  <button onClick={() => deletePujaCommission(item._id)}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatCommission;
