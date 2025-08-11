"use client";
import Loader from "@/app/component/Loader";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AddLanguage = () => {
  const [languageListData, setLanguageListData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmitAddLanguage = async () => {
    const language = document.getElementById("language").value.trim();

    if (!language) {
      toast.warning("Please enter a language name.", { position: "top-right" });
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/add-Language-astrologer`,
        {
          languages: language,
        }
      );

      if (response.data.message === "success") {
        toast.success("Language added successfully!", { position: "top-right" });
        document.getElementById("language").value = "";
        fetchLanguageList(); // Refresh list
      }
    } catch (error) {
      console.error("Add language error:", error);
      toast.error("Failed to add language.", { position: "top-right" });
    }
  };

  const fetchLanguageList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/add-Language-astrologer`
      );
      setLanguageListData(response.data); 
    } catch (error) {
      console.error("Fetch language list error:", error);
      toast.error("Failed to fetch languages.", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  const deleteLanguage = async (id) => {
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/delete-language-astrologer/${id}`
      );

      if (res.data.message === "success") {
        toast.success("Language removed successfully!", { position: "top-right" });
        fetchLanguageList(); // Refresh list after delete
      }
    } catch (err) {
      console.error("Delete language error:", err);
      toast.error("Failed to delete language.", { position: "top-right" });
    }
  };

  useEffect(() => {
    fetchLanguageList();
  }, []);

  return (
    <div className="AddLanguage">
      <div className="language-add-data">
        <h2>Add a New Language</h2>
        <div className="admin-form-box">
          <div className="form-field">
            <input type="text" placeholder="Language Name" id="language" className="common-input-filed" />
          </div>
          <button onClick={handleSubmitAddLanguage}>Add Language</button>
        </div>
      </div>

      <div className="language-list">
        <h2>Available Languages</h2>
        {loading ? (
           <Loader/>
        ) : (
          <ul>
            {languageListData.map((item) => (
              <li key={item._id}>
                {item.languages}
                <button onClick={() => deleteLanguage(item._id)}>
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

export default AddLanguage;
