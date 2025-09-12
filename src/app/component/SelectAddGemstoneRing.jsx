import React, { useState } from "react";
import { useEffect } from "react";

const SelectAddGemstoneRing = ({
  gemStoneJewelryData,
  setViewAllBtn,
  gemstoneData,
  setGemstoneData,
}) => {
useEffect(() => {
  const selectEl = document.getElementById("ringSizeSelect");
  const ringInputDiv = document.querySelector(".ring-size-text");

  function handleRingSizeChange() {
    const selected = selectEl?.value;
    if (selected === "I know my Ring Size") {
      ringInputDiv.style.display = "block";
    } else {
      ringInputDiv.style.display = "none";
      document.getElementById("ringSize").value = ""; // reset input
    }
  }

  if (selectEl && ringInputDiv) {
    handleRingSizeChange(); // initial state
    selectEl.addEventListener("change", handleRingSizeChange);
  }

  return () => {
    if (selectEl) {
      selectEl.removeEventListener("change", handleRingSizeChange);
    }
  };
}, [gemstoneData]); // Re-run effect when gemstoneData changes


  return (
    <>
      <div className="product-add-ons">
        <div className="add-ons-head">
          <h2>Please select add ons</h2>
          <button onClick={() => setViewAllBtn(true)}>View all</button>
        </div>
        <div className="product-add-ons-listing">
          {gemStoneJewelryData?.slice(0, 4).map((item, index) => (
            <div
              className={`single-add-on ${
                item?._id == gemstoneData?._id ? "active" : ""
              }`}
              key={index}
              onClick={() => setGemstoneData(item)}
            >
              <div className="add-on-img">
                <img src={item?.astroGemstoneJewelryImg} alt="" />
              </div>
              <div className="add-on-details">
                <div className="addon-name">{item?.name}</div>
                <div className="addon-price">₹ {item?.actual_price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {gemstoneData?.productType == "Ring" && (
        <div className="product-main-size">
          <div className="product-right-dropdown">
            <select id="ringSizeSelect" defaultValue="">
              <option value="">Select Ring Size</option>
              <option value="Free Size">Free Size</option>
              <option value="I know my Ring Size">I know my Ring Size</option>
              <option value="I don't know, please call me">
                I don't know, please call me
              </option>
            </select>
          </div>
          <div className="ring-size-text" style={{ display: "none" }}>
            <input
              id="ringSize"
              type="text"
              placeholder="Enter your ring size"
              // style={{ display: "none" }}
            />
          </div>
        </div>
      )}
      {gemstoneData && (
        <div className="booked_selected_items">
          <div>
            <div className="booked_selected_items-img">
              <img
                src={gemstoneData?.astroGemstoneJewelryImg}
                alt={gemstoneData?.name}
              />
            </div>
            <div className="booked_selected_items-content">
              <div className="name">{gemstoneData?.name}</div>
              <div className="price">₹ {gemstoneData?.actual_price}</div>
            </div>
          </div>
          <span className="close" onClick={()=> setGemstoneData()}>X</span>
        </div>
      )}
    </>
  );
};

export default SelectAddGemstoneRing;
