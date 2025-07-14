import React, { useEffect, useState } from "react";

const RingGemstonePopUp = ({ setViewAllBtn, gemStoneJewelryData, gemstoneData, setGemstoneData }) => {
console.log(gemstoneData);

  useEffect(() => {
    if (gemStoneJewelryData && gemStoneJewelryData.length > 0) {
      setGemstoneData(gemStoneJewelryData[0]);
    }
  }, [gemStoneJewelryData]);
  return (
    <>
      <div className="addon-popup-outer">
        <div className="addon-popup-inner">
          <span className="close" onClick={() => setViewAllBtn(false)}>
            X
          </span>
          <h2>Please select addons</h2>
          <div className="popup-addons-sec">
            <div className="popup-addons-left">
              <div className="addon-large-img">
                <img src={gemstoneData?.astroGemstoneJewelryImg} alt={gemstoneData?.name} />
              </div>
              <div className="addon-name_price_product_modal">
                <div className="product-name">{gemstoneData?.name}</div>
                <div className="product-price">₹ {gemstoneData?.actual_price}</div>
              </div>
            </div>
            <div className="popup-addons-right">
              <div className="popup-addons-listing">
                {gemStoneJewelryData?.map((item, index) => (
                  <div className={`single-popup-addon ${gemstoneData?._id==item?._id ? "active"  :""}`} key={index} onClick={()=>setGemstoneData(item)}>
                    <div className="addon-img">
                      <img src={item?.astroGemstoneJewelryImg} alt={item?.name} />
                    </div>
                    <div className="name_product_modal">{item?.name}</div>
                    <div className="price_modal_product">₹ {item?.actual_price}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="addon-popup-btn">
            <button onClick={() => setViewAllBtn(false)}>Select add ons</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RingGemstonePopUp;
