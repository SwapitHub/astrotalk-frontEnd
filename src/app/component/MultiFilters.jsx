"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { validateAstrologerForm } from "./FormValidation";
import { toast } from "react-toastify";
import secureLocalStorage from "react-secure-storage";

const MultiFilters = ({
  setMultiFilterStatus,
  setFindLanguageListData,
  findLanguageListData,
  findSkillsListData,
  setFindSkillsListData,
  countryData,
  setCountryData,
  genderData,
  setGenderData,
  languageListData,
  skillsListData,
}) => {
  const [activeTab, setActiveTab] = useState("skill");
  const [getProfessionsList, setGetProfessionsList] =
    useState(findSkillsListData);
  const [getLanguageListData, setGetLanguageListData] =
    useState(findLanguageListData);
  const [getGenderListData, setGetGenderListData] = useState(genderData);
  const [getCountryListData, setGetCountryListData] = useState(countryData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    
    const storedLanguages = JSON.parse(
      secureLocalStorage.getItem("selectedLanguages")
    );
    const storedSkills = JSON.parse(secureLocalStorage.getItem("selectedSkills"));
    const storedGender = JSON.parse(secureLocalStorage.getItem("selectedGender"));
    const storedCountry = JSON.parse(secureLocalStorage.getItem("selectedCountry"));

    // If no data, first time -> Save default data into secureLocalStorage
    if (!storedLanguages || !storedSkills || !storedGender || !storedCountry) {
      const defaultLanguages = languageListData.map((lang) => lang.languages);
      const defaultSkills = skillsListData.map((skill) => skill.professions);
      const defaultGender = ["Male", "Female"]; // assuming you have these
      const defaultCountry = ["India", "Outside_India"]; // assuming you have these

      secureLocalStorage.setItem(
        "selectedLanguages",
        JSON.stringify(defaultLanguages)
      );
      secureLocalStorage.setItem("selectedSkills", JSON.stringify(defaultSkills));
      secureLocalStorage.setItem("selectedGender", JSON.stringify(defaultGender));
      secureLocalStorage.setItem("selectedCountry", JSON.stringify(defaultCountry));

      setGetLanguageListData(defaultLanguages);
      setGetProfessionsList(defaultSkills);
      setGetGenderListData(defaultGender);
      setGetCountryListData(defaultCountry);

      // Also update parent states
      setFindLanguageListData(defaultLanguages);
      setFindSkillsListData(defaultSkills);
      setGenderData(defaultGender);
      setCountryData(defaultCountry);
    } else {
      // If data exists, load from secureLocalStorage
      setGetLanguageListData(storedLanguages);
      setGetProfessionsList(storedSkills);
      setGetGenderListData(storedGender);
      setGetCountryListData(storedCountry);

      // Also update parent states
      setFindLanguageListData(storedLanguages);
      setFindSkillsListData(storedSkills);
      setGenderData(storedGender);
      setCountryData(storedCountry);
    }
  }, [languageListData, skillsListData]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const onchangeApplyBtn = () => {
    const validationErrors = validateAstrologerForm();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    secureLocalStorage.setItem(
      "selectedLanguages",
      JSON.stringify(getLanguageListData)
    );
    secureLocalStorage.setItem("selectedSkills", JSON.stringify(getProfessionsList));
    secureLocalStorage.setItem("selectedGender", JSON.stringify(getGenderListData));
    secureLocalStorage.setItem("selectedCountry", JSON.stringify(getCountryListData));

    // Set in parent state also
    setFindLanguageListData(getLanguageListData);
    setFindSkillsListData(getProfessionsList);
    setGenderData(getGenderListData);
    setCountryData(getCountryListData);

    setTimeout(() => {
      setMultiFilterStatus(false);
    }, 500);
  };

  useEffect(() => {
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

  const resetFilters = () => {
    const defaultLanguages = languageListData.map((lang) => lang.languages);
    const defaultSkills = skillsListData.map((skill) => skill.professions);
    const defaultGender = ["Male", "Female"];
    const defaultCountry = ["India", "Outside_India"];

    // Update local state
    setGetLanguageListData(defaultLanguages);
    setGetProfessionsList(defaultSkills);
    setGetGenderListData(defaultGender);
    setGetCountryListData(defaultCountry);

    // Update parent state too
    setFindLanguageListData(defaultLanguages);
    setFindSkillsListData(defaultSkills);
    setGenderData(defaultGender);
    setCountryData(defaultCountry);

    // Save into secureLocalStorage
    secureLocalStorage.setItem("selectedLanguages", JSON.stringify(defaultLanguages));
    secureLocalStorage.setItem("selectedSkills", JSON.stringify(defaultSkills));
    secureLocalStorage.setItem("selectedGender", JSON.stringify(defaultGender));
    secureLocalStorage.setItem("selectedCountry", JSON.stringify(defaultCountry));

    setMultiFilterStatus(false);
  };

  const handleChangeSelectall = () => {
    const defaultSkills = skillsListData.map((skill) => skill.professions);
    setGetProfessionsList(defaultSkills);
    setFindSkillsListData(defaultSkills);
    secureLocalStorage.setItem("selectedSkills", JSON.stringify(defaultSkills));
  };
  const handleChangeClearAll = () => {
    setGetProfessionsList([]);
    setFindSkillsListData([]);
    secureLocalStorage.setItem("selectedSkills", JSON.stringify([]));
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
                  <button onClick={handleChangeSelectall}>Select All </button>
                  <button onClick={handleChangeClearAll}>Clear All </button>
                </div>
                {skillsListData?.map((item) => (
                  <label key={item._id}>
                    <input
                      type="checkbox"
                      name="professions"
                      id="professions"
                      value={item.professions}
                      checked={getProfessionsList.includes(item.professions)}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (e.target.checked) {
                          setGetProfessionsList((prev) =>
                            Array.isArray(prev) ? [...prev, value] : [value]
                          );
                        } else {
                          setGetProfessionsList((prev) =>
                            Array.isArray(prev)
                              ? prev.filter((l) => l !== value)
                              : [value]
                          );
                        }
                      }}
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
                        checked={getLanguageListData.includes(lang.languages)}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (e.target.checked) {
                            setGetLanguageListData((prev) =>
                              Array.isArray(prev) ? [...prev, value] : [value]
                            );
                          } else {
                            setGetLanguageListData((prev) =>
                              Array.isArray(prev)
                                ? prev.filter((l) => l !== value)
                                : [value]
                            );
                          }
                        }}
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
                {["Male", "Female"].map((item) => {
                  return (
                    <label key={item}>
                      <input
                        type="checkbox"
                        id="Male"
                        name="gender"
                        value={item}
                        checked={getGenderListData.includes(item)}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (e.target.checked) {
                            setGetGenderListData((prev) =>
                              Array.isArray(prev) ? [...prev, value] : [value]
                            );
                          } else {
                            setGetGenderListData((prev) =>
                              Array.isArray(prev)
                                ? prev.filter((l) => l !== value)
                                : [value]
                            );
                          }
                        }}
                      />{" "}
                      <span>{item}</span>
                    </label>
                  );
                })}
              </div>

              <div
                className={`tab-pane ${
                  activeTab === "country" ? "active" : ""
                }`}
              >
                {["India", "Outside_India"].map((item) => {
                  return (
                    <label key={item}>
                      <input
                        type="checkbox"
                        name="country"
                        value={item}
                        checked={getCountryListData.includes(item)}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (e.target.checked) {
                            setGetCountryListData((prev) =>
                              Array.isArray(prev) ? [...prev, value] : [value]
                            );
                          } else {
                            setGetCountryListData((prev) =>
                              Array.isArray(prev)
                                ? prev.filter((l) => l !== value)
                                : [value]
                            );
                          }
                        }}
                      />{" "}
                      <span>{item}</span>
                    </label>
                  );
                })}
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
            <button onClick={resetFilters}>Reset</button>
            <button
              className="apply-button"
              onClick={() => {
                onchangeApplyBtn();
              }}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiFilters;
