"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { validateAstrologerForm } from "./FormValidation";
import { toast } from "react-toastify";

const MultiFilters = ({ setMultiFilterStatus, setMultiFilter, multiFilter }) => {
  const [activeTab, setActiveTab] = useState("skill");
  const [professionsList, setProfessionsList] = useState([]);
  const [languageListData, setLanguageListData] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const [languageResponse, professionResponse] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/add-Language-astrologer`),
          axios.get(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/add-Profession-astrologer`),
        ]);

        setLanguageListData(languageResponse.data);
        setProfessionsList(professionResponse.data);
      } catch (error) {
        console.error("Error fetching filter data:", error);
      }
    };

    fetchFilterData();
  }, []);

  useEffect(() => {
    const errorKeys = Object.keys(errors);
    if (errorKeys.length > 0) {
      const firstErrorKey = errorKeys[0];
      toast.error(errors[firstErrorKey], { position: "bottom-left" });
    }
  }, [errors]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const onchangeApplyBtn = () => {
    const selectedLanguages = Array.from(
      document.querySelectorAll('input[name="languages"]:checked')
    ).map((checkbox) => checkbox.value);

    const selectedProfessions = Array.from(
      document.querySelectorAll('input[name="professions"]:checked')
    ).map((checkbox) => checkbox.value);

    const selectedGenders = Array.from(
      document.querySelectorAll('input[name="gender"]:checked')
    ).map((checkbox) => checkbox.value);

    const selectedCountries = Array.from(
      document.querySelectorAll('input[name="country"]:checked')
    ).map((checkbox) => checkbox.value);

    const queryParams = new URLSearchParams();
    if (selectedLanguages.length)
      queryParams.append("languages", selectedLanguages.join(","));
    if (selectedProfessions.length)
      queryParams.append("professions", selectedProfessions.join(","));
    if (selectedGenders.length)
      queryParams.append("gender", selectedGenders.join(","));
    if (selectedCountries.length)
      queryParams.append("country", selectedCountries.join(","));

    setMultiFilter(queryParams.toString());

    const validationErrors = validateAstrologerForm();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
  };

  return (
    <div className="filter-modal">
      <div className="main-recharge-popup">
        <div className="recharge-popup">
          <div className="filter-header">
            <span>FILTERS</span>
            <button onClick={() => setMultiFilterStatus(false)}>
              <span>&times;</span>
            </button>
          </div>

          <div className="filter-outer">
            <div className="filter-tabs">
              {["skill", "language", "gender", "country", "offer", "top Astrologer"].map((tab) => (
                <button
                  key={tab}
                  className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                  onClick={() => handleTabClick(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1).replace("_", " ")}
                </button>
              ))}
            </div>

            <div className="filter-content">
              <div className={`tab-pane ${activeTab === "skill" ? "active" : ""}`} id="skill">
                <div className="inner-clear-button">
                  <button>Select All</button>
                  <button>Clear All</button>
                </div>
                {professionsList?.map((item) => (
                  <label key={item._id}>
                    <input type="checkbox" name="professions" value={item.professions} />
                    <span>{item.professions}</span>
                  </label>
                ))}
              </div>

              <div className={`tab-pane ${activeTab === "language" ? "active" : ""}`} id="language">
                {languageListData?.map((lang) => (
                  <label key={lang._id}>
                    <input type="checkbox" name="languages" value={lang.languages} />
                    <span>{lang.languages}</span>
                  </label>
                ))}
              </div>

              <div className={`tab-pane ${activeTab === "gender" ? "active" : ""}`} id="gender">
                <label>
                  <input type="checkbox" name="gender" value="Male" /> <span>Male</span>
                </label>
                <label>
                  <input type="checkbox" name="gender" value="Female" /> <span>Female</span>
                </label>
              </div>

              <div className={`tab-pane ${activeTab === "country" ? "active" : ""}`} id="country">
                <label>
                  <input type="checkbox" name="country" value="India" /> <span>India</span>
                </label>
                <label>
                  <input type="checkbox" name="country" value="Outside India" /> <span>Outside India</span>
                </label>
              </div>

              <div className={`tab-pane ${activeTab === "offer" ? "active" : ""}`} id="offer">
                <label>
                  <input type="checkbox" name="Offer" /> <span>Active</span>
                </label>
                <label>
                  <input type="checkbox" name="Offer" /> <span>Not Active</span>
                </label>
              </div>

              <div className={`tab-pane ${activeTab === "top Astrologer" ? "active" : ""}`} id="top">
                {[
                  {
                    label: "Celebrity",
                    desc: "They have the highest fan following & people are crazy about them",
                  },
                  {
                    label: "Top Choice",
                    desc: "If you talk to them once, you are their customer for life",
                  },
                  {
                    label: "Rising Star",
                    desc: "They are high in demand & have strong customer loyalty",
                  },
                  {
                    label: "All",
                    desc: "It includes all verified astrologers, hired after 5 rounds of interviews",
                  },
                ].map((item) => (
                  <label key={item.label}>
                    <input type="checkbox" name="top_astrologer" /> <span>{item.label}</span>
                    <p>{item.desc}</p>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="filter-footer">
            <button>Reset</button>
            <button className="apply-button" onClick={onchangeApplyBtn}>Apply</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiFilters;
