import Image from "next/image";
import React, { useEffect, useState } from "react";

const RingGemstonePopUp = ({
  viewAllBtn,
  setViewAllBtn,
  gemStoneJewelryData,
  gemstoneData,
  setGemstoneData,
}) => {
  console.log(viewAllBtn);

  // useEffect(() => {
  //   if (gemStoneJewelryData && gemStoneJewelryData.length > 0) {
  //     setGemstoneData(gemStoneJewelryData[0]);
  //   }
  // }, [gemStoneJewelryData]);
  return (
    <>
      <div className="addon-popup-outer">
        <div className="addon-popup-inner">
          <span className="close" onClick={() => setViewAllBtn(false)}>
            X
          </span>
          <h2>Please select addons</h2>
          <div className="popup-addons-sec">
            {gemstoneData?._id && (
              <div className="popup-addons-left">
                <div className="addon-large-img">
                  <Image
                    width={100}
                    height={100}
                    src={
                      gemstoneData?.astroGemstoneJewelryImg
                        ? process.env.NEXT_PUBLIC_WEBSITE_URL +
                          gemstoneData?.astroGemstoneJewelryImg
                        : "/user-icon-image.png"
                    }
                    alt={gemstoneData?.name}
                  />
                </div>
                <div className="addon-name_price_product_modal">
                  <div className="product-name">{gemstoneData?.name}</div>
                  <div className="product-price">
                    ₹ {gemstoneData?.actual_price}
                  </div>
                </div>
              </div>
            )}
            <div className="popup-addons-right">
              <div className="popup-addons-listing">
                {gemStoneJewelryData?.map((item, index) => (
                  <div
                    className={`single-popup-addon ${
                      gemstoneData?._id == item?._id ? "active" : ""
                    }`}
                    key={index}
                    onClick={() => setGemstoneData(item)}
                  >
                    <div className="addon-img">
                      <Image
                        width={100}
                        height={100}
                        src={
                          item?.astroGemstoneJewelryImg
                            ? process.env.NEXT_PUBLIC_WEBSITE_URL +
                              item?.astroGemstoneJewelryImg
                            : "/user-icon-image.png"
                        }
                        alt={item?.name}
                      />
                    </div>
                    <div className="name_product_modal">{item?.name}</div>
                    <div className="price_modal_product">
                      ₹ {item?.actual_price}
                    </div>
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
