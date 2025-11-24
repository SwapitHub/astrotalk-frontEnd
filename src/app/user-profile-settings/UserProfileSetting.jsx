"use client";
import React, { useEffect, useState, useCallback } from "react";
import WalletEdit from "../admin/dashboard/wallet/WalletEditUser";
import Cookies from "js-cookie";
import axios from "axios";
import Loader from "../component/Loader";
import { useRouter } from "next/navigation";
import DeletePopUp from "../component/DeletePopUp";

const UserProfileSetting = () => {
  let showNameData = "User";

  const [userMobile, setUserMobile] = useState(null);
  const [userDetailData, setUserDetailData] = useState(null); // Added state for storing user data
  const [loading, setLoading] = useState(false);
  const [addActiveClassEdit, setAddActiveClassEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deletePermanently, setDeletePermanently] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const router = useRouter();
  console.log("userDetailData", userDetailData);

  // Get userMobile from cookies on initial render
  useEffect(() => {
    const storedMobile = Cookies.get("userMobile");
    if (storedMobile) {
      setUserMobile(Math.round(storedMobile));
    }
  }, []);

  // Define fetchUserDetail as a separate function
  const fetchUserDetail = useCallback(async () => {
    if (!userMobile) return;

    setLoading(true); // Set loading to true when the API call starts

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/user-login-detail/${userMobile}`
      );
      setUserDetailData(response.data.data);
      if (response?.status == 200) {
        window.location.reload();
      }
      console.log("API response:", response);
    } catch (err) {
      console.error("user detail api error:", err);
    } finally {
      setLoading(false);
    }
  }, [userMobile]);



  const userLogout = () => {
    window.dispatchEvent(new Event("userMobileUpdatedRemoved"));
    Cookies.remove("userIds");
    Cookies.remove("userMobile");
    Cookies.remove("astrologerId");
    Cookies.remove("AstrologerNotificationStatus");
    setUserMobile(null);
    setTimeout(() => {
      router.push("/chat-with-astrologer");
    }, 200);

    setTimeout(() => {
      window.location.reload();
    }, 400);
  };

  useEffect(() => {
    if (
      userDetailData?.blockUser == true ||
      userDetailData?.deleteUser == true
    ) {
      userLogout();
    }
  }, [userDetailData]);

  // 🧱 Soft-delete user
  const deleteUser = async () => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/update-user/${selectedUserId}`,
        { deleteUser: true }
      );
      setShowDelete(false);
      setTimeout(() => {
        router.push("/chat-with-astrologer");
      }, 200);

      setTimeout(() => {
        window.location.reload();
      }, 400);
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  useEffect(() => {
    if (selectedUserId && deletePermanently) {
      deleteUser();
    }
  }, [deletePermanently]);
  // Effect for managing body class when edit modal is toggled
  useEffect(() => {
    if (addActiveClassEdit) {
      document.body.classList.add("wallet-edit-popup");
    } else {
      document.body.classList.remove("wallet-edit-popup");
    }
  }, [addActiveClassEdit]);

  return (
    <section className="main-user-profile">
      {loading && <Loader />}

      <div className="container">
        {/* 🔔 Delete confirmation popup */}
        {showDelete && (
          <DeletePopUp
            setShowDelete={setShowDelete}
            setDeletePermanently={setDeletePermanently}
            showNameData={showNameData}
          />
        )}

        {addActiveClassEdit && (
          <WalletEdit
            userMobile={userMobile}
            setAddActiveClassEdit={setAddActiveClassEdit}
            fetchTransactions={fetchUserDetail}
            setLoading={setLoading}
          />
        )}

        <div className="user-profile">
          <button onClick={() => setAddActiveClassEdit(true)}>
            Edit Profile
          </button>
          <button onClick={userLogout}>Log out</button>
          <button
            onClick={() => {
              setSelectedUserId(userDetailData?.id);
              setShowDelete(true);
            }}
          >
            Delete My Account
          </button>
        </div>
      </div>
    </section>
  );
};

export default UserProfileSetting;
