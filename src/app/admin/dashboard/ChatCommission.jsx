"use client";
import Loader from "@/app/component/Loader";
import axios from "axios";
import React, { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import { toast } from "react-toastify";

const ChatCommission = () => {
  const [chatCommission, setChatCommission] = useState([]);
  const [disableButton, setDisableButton] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchChatCommission();

    const storedStatus = secureLocalStorage.getItem("buttonStatus");
    setDisableButton(storedStatus === "true"); 
  }, []);

  const handleSubmitAddAdminCommission = async () => {
    const AdminCommission = document
      .getElementById("AdminCommission")
      ?.value.trim();

    if (!AdminCommission) {
      toast.warning("Please enter a AdminCommission Price.", {
        position: "top-right",
      });
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/add-AdminCommission-astrologer`,
        { AdminCommissions: AdminCommission }
      );

      if (response.data.message === "success") {
        toast.success("AdminCommission added successfully!", {
          position: "top-right",
        });
        document.getElementById("AdminCommission").value = "";
        fetchChatCommission();
        setDisableButton(secureLocalStorage.setItem("buttonStatus", "true"));
        setDisableButton(true);
      }
    } catch (error) {
      console.error("Add AdminCommission error:", error);
      toast.error("Failed to add AdminCommission", { position: "top-right" });
    }
  };

  const fetchChatCommission = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/add-AdminCommission-astrologer`
      );
      setChatCommission(response.data); // Assuming it's a plain array
    } catch (error) {
      console.error("Fetch AdminCommissions list error:", error);
      toast.error("Failed to fetch AdminCommissions", {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteAdminCommission = async (id) => {
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/delete-AdminCommission-astrologer/${id}`
      );
      if (res.data.message === "success") {
        toast.success("AdminCommission removed successfully!", {
          position: "top-right",
        });
        fetchChatCommission();
        secureLocalStorage.removeItem("buttonStatus");
        setDisableButton(false);
      }
    } catch (err) {
      console.error("Delete AdminCommission error:", err);
      toast.error("Failed to delete AdminCommission", {
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    fetchChatCommission();
  }, []);

  return (
    <div className="AddAdminCommissions AddLanguage">
      <div className="language-add-data">
        <h2>Admin to Astrologer Chat Commission (Based on Percentage)</h2>
        <input
          type="text"
          placeholder="AdminCommission Name"
          id="AdminCommission"
        />
        <button
          disabled={disableButton}
          className={disableButton && "disable"}
          onClick={handleSubmitAddAdminCommission}
        >
          Add AdminCommission
        </button>
      </div>

      <div className="language-list">
        <h2>Available AdminCommissions</h2>
        {loading ? (
           <Loader/>
        ) : (
          <ul>
            {chatCommission.map((item) => (
              <li key={item._id}>
                {item.AdminCommissions} %
                <button onClick={() => deleteAdminCommission(item._id)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ChatCommission;
