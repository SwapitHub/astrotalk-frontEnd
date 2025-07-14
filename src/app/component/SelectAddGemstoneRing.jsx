import React, { useState } from "react";

const SelectAddGemstoneRing = ({ gemStoneJewelryData, setViewAllBtn,gemstoneData, 
                    setGemstoneData }) => {
  
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
              className={`single-add-on ${item?._id == gemstoneData?._id?"active":""}`}
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
      <div className="product-right-dropdown">
        <select>
          <option>Select Ring Size</option>
          <option>Free Size</option>
          <option>I know my Ring Size</option>
          <option>I don't know, please call me</option>
        </select>
      </div>

{
    gemstoneData &&  <div className="booked_selected_items">
        <div>
          <div>
            <img src={gemstoneData?.astroGemstoneJewelryImg} alt={gemstoneData?.name} />
          </div>
          <div className="name">{gemstoneData?.name}</div>
          <div className="price">₹ {gemstoneData?.actual_price}</div>
        </div>
        <span className="close">X</span>
      </div>
}
     
    </>
  );
};

export default SelectAddGemstoneRing;
