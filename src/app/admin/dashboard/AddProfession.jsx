"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AddProfessions = () => {
  const [professionsList, setProfessionsList] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmitAddProfession = async () => {
    const profession = document.getElementById("profession")?.value.trim();

    if (!profession) {
      toast.warning("Please enter a profession name.", { position: "top-right" });
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/add-Profession-astrologer`,
        { professions: profession }
      );

      if (response.data.message === "success") {
        toast.success("Profession added successfully!", { position: "top-right" });
        document.getElementById("profession").value = "";
        fetchProfessionsList();
      }
    } catch (error) {
      console.error("Add profession error:", error);
      toast.error("Failed to add profession", { position: "top-right" });
    }
  };

  const fetchProfessionsList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/add-Profession-astrologer`);
      setProfessionsList(response.data); // Assuming it's a plain array
     
    } catch (error) {
      console.error("Fetch professions list error:", error);
      toast.error("Failed to fetch professions", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  const deleteProfession = async (id) => {
    try {
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/delete-Profession-astrologer/${id}`);
      if (res.data.message === "success") {
        toast.success("Profession removed successfully!", { position: "top-right" });
        fetchProfessionsList()
      }
    } catch (err) {
      console.error("Delete profession error:", err);
      toast.error("Failed to delete profession", { position: "top-right" });
    }
  };

  useEffect(() => {
    fetchProfessionsList();
  }, []);

  return (
    <div className="AddProfessions AddLanguage">
      <div className="language-add-data">
        <h2>Add a New Profession</h2>
        <input type="text" placeholder="Profession Name" id="profession" />
        <button onClick={handleSubmitAddProfession}>Add Profession</button>
      </div>

      <div className="language-list">
        <h2>Available Professions</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {professionsList.map((item) => (
              <li key={item._id}>
                {item.professions}
                <button onClick={() => deleteProfession(item._id)}>
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

export default AddProfessions;
