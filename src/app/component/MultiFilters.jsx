"use client";
import React, { useState } from "react";

const MultiFilters = ({ setMultiFilterStatus }) => {
  const [activeTab, setActiveTab] = useState("skill");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
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
                <label>
                  <input type="checkbox" /> <span>Tarot</span>
                </label>
                <label>
                  <input type="checkbox" /> <span>Vedic</span>
                </label>
              </div>

              <div
                className={`tab-pane ${
                  activeTab === "language" ? "active" : ""
                }`}
                id="language"
              >
                {[
                  "English",
                  "Hindi",
                  "Bengali",
                  "Gujarati",
                  "Kannada",
                  "Malayalam",
                  "Marathi",
                  "Punjabi",
                ].map((lang) => (
                  <label key={lang}>
                    <input type="checkbox" /> <span>{lang}</span>
                  </label>
                ))}
              </div>

              <div
                className={`tab-pane ${activeTab === "gender" ? "active" : ""}`}
                id="gender"
              >
                <label>
                  <input type="checkbox" name="gender" /> <span>Male</span>
                </label>
                <label>
                  <input type="checkbox" name="gender" /> <span>Female</span>
                </label>
              </div>

              <div
                className={`tab-pane ${
                  activeTab === "country" ? "active" : ""
                }`}
                id="country"
              >
                <label>
                  <input type="checkbox" /> <span>India</span>
                </label>
                <label>
                  <input type="checkbox" /> <span>USA</span>
                </label>
              </div>

              <div
                className={`tab-pane ${activeTab === "offer" ? "active" : ""}`}
                id="offer"
              >
                <label>
                  <input type="checkbox" /> <span>Discount</span>
                </label>
                <label>
                  <input type="checkbox" /> <span>First Call Free</span>
                </label>
              </div>

              <div
                className={`tab-pane ${
                  activeTab === "top Astrologer" ? "active" : ""
                }`}
                id="top"
              >
                <label>⭐ Top Rated Astrologers</label>
              </div>
            </div>
          </div>

          <div className="filter-footer">
            <button>Reset</button>
            <button className="apply-button">Apply</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiFilters;
