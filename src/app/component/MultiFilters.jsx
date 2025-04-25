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
// console.log(multiFilterLanguage);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const fetchLanguageList = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/add-Language-astrologer`
      );
      setLanguageListData(response.data);
    } catch (error) {
      console.error("Fetch language list error:", error);
    } finally {
    }
  };

  const fetchProfessionsList = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/add-Profession-astrologer`
      );
      setProfessionsList(response.data);
    } catch (error) {
      console.error("Fetch professions list error:", error);
    }
  };
  useEffect(() => {
    fetchProfessionsList();
    fetchLanguageList();
    if (
      errors.languages ||
      errors.professions ||
      errors.gender ||
      errors.country ||
      errors.Offer ||
      errors.top_astrologer
    ) {
      toast.error(
        `${
          errors.languages ||
          errors.professions ||
          errors.gender ||
          errors.country ||
          errors.Offer ||
          errors.top_astrologer
        }`,
        {
          position: "bottom-left",
        }
      );
    }
  }, [errors]);

  const onchangeApplyBtn = () => {
    // ✅ Get all checked languages
    const selectedLanguages = Array.from(
      document.querySelectorAll('input[name="languages"]:checked')
    ).map((checkbox) => checkbox.value);

    // ✅ Get selected professions
    const selectedProfessions = Array.from(
      document.querySelectorAll('input[name="professions"]:checked')
    ).map((checkbox) => checkbox.value);

    // ✅ Get selected gender(s)
    const selectedGenders = Array.from(
      document.querySelectorAll('input[name="gender"]:checked')
    ).map((checkbox) => checkbox.value);

    // ✅ Get selected countries
    const selectedCountries = Array.from(
      document.querySelectorAll('input[name="country"]:checked')
    ).map((checkbox) => checkbox.value);

    // ✅ Optional: Save to state if needed
   

    // ✅ Build query string
    const queryParams = new URLSearchParams();
    if (selectedLanguages.length)
      queryParams.append("languages", selectedLanguages.join(","));
    if (selectedProfessions.length)
      queryParams.append("professions", selectedProfessions.join(","));
    if (selectedGenders.length)
      queryParams.append("gender", selectedGenders.join(","));
    if (selectedCountries.length)
      queryParams.append("country", selectedCountries.join(","));

    // console.log("Selected selectedProfession:", queryParams.toString());
    setMultiFilter(queryParams.toString())
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
            <button
              onClick={() => {
                setMultiFilterStatus(false);
              }}
            >
              <span>&times;</span>
            </button>
          </div>
          <div className="filter-outer">
            <div className="filter-tabs">
              {[
                "skill",
                "language",
                "gender",
                "country",
                "offer",
                "top Astrologer",
              ].map((tab) => (
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
              <div
                className={`tab-pane ${activeTab === "skill" ? "active" : ""}`}
                id="skill"
              >
                <div className="inner-clear-button">
                  <button>Select All </button>
                  <button>Clear All </button>
                </div>
                {professionsList?.map((item) => (
                  <label key={item._id}>
                    <input
                      type="checkbox"
                      name="professions"
                      id="professions"
                      value={item.professions}
                    />
                    <span>{item.professions}</span>
                  </label>
                ))}
              </div>

              <div
                className={`tab-pane ${
                  activeTab === "language" ? "active" : ""
                }`}
                id="language"
              >
                {languageListData?.map((lang) => {
                  return (
                    <label key={lang._id}>
                      <input
                        type="checkbox"
                        name="languages"
                        value={lang.languages}
                        id="languages"
                        // onChange={handleLanguageCheckboxChange}
                      />
                      <span>{lang.languages}</span>
                    </label>
                  );
                })}
              </div>

              <div
                className={`tab-pane ${activeTab === "gender" ? "active" : ""}`}
                id="gender"
              >
                <label>
                  <input type="checkbox" id="Male" name="gender" value="Male" />{" "}
                  <span>Male</span>
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="gender"
                    id="Female"
                    value="Female"
                  />{" "}
                  <span>Female</span>
                </label>
              </div>

              <div
                className={`tab-pane ${
                  activeTab === "country" ? "active" : ""
                }`}
               
              >
                <label>
                <input type="checkbox" name="country" value="India" />{" "}
                  <span>India</span>
                </label>
                <label>
                <input type="checkbox" name="country" value="Outside India" />{" "}
                  <span>Outside India</span>
                </label>
              </div>

              <div
                className={`tab-pane ${activeTab === "offer" ? "active" : ""}`}
                id="offer"
              >
                <label>
                  <input type="checkbox" name="Offer" /> <span>Active</span>
                </label>
                <label>
                  <input type="checkbox" name="Offer" /> <span>Not Active</span>
                </label>
              </div>

              <div
                className={`tab-pane ${
                  activeTab === "top Astrologer" ? "active" : ""
                }`}
                id="top"
              >
                <label>
                  <input type="checkbox" name="top_astrologer" />{" "}
                  <span>Celebrity</span>
                  <p>
                    They have the highest fan following & people are crazy about
                    them
                  </p>
                </label>
                <label>
                  <input type="checkbox" name="top_astrologer" />{" "}
                  <span>Top Choice</span>
                  <p>
                    If you talk to them once, you are their customer for life
                  </p>
                </label>
                <label>
                  <input type="checkbox" name="top_astrologer" />{" "}
                  <span>Rising Star</span>
                  <p>They are high in demand & have strong customer loyalty</p>
                </label>
                <label>
                  <input type="checkbox" name="top_astrologer" />{" "}
                  <span>All</span>
                  <p>
                    It includes all verified astrologers, hired after 5 rounds
                    of interviews
                  </p>
                </label>
              </div>
            </div>
          </div>

          <div className="filter-footer">
            <button>Reset</button>
            <button className="apply-button" onClick={()=>{onchangeApplyBtn()}}>
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiFilters;
