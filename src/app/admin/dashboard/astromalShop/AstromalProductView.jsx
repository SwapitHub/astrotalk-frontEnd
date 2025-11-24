import Image from "next/image";
import React from "react";

const AstromalProductView = ({ viewProductData, setViewProductStatus }) => {

  return (
    <div className="astro-detail-mains">
      <span
        className="close"
        onClick={() => {
          setViewProductStatus(false);
        }}
      >
        X
      </span>
      <div className="profile-table">
        <div className="inner-profile-table">
          <div className="common-profile">
            <div className="name">Image</div>
            <div className="input-outer">
              <Image
                width={300}
                height={233}
                src={
                  viewProductData?.astroMallProductImg
                    ? process.env.NEXT_PUBLIC_WEBSITE_URL +
                      viewProductData?.astroMallProductImg
                    : "./user-icon-image.png"
                }
                alt="user-icon"
              />
            </div>
          </div>

          <div className="common-profile">
            <div className="name">Name</div>
            <div className="input-outer">{viewProductData?.name}</div>
          </div>
          <div className="common-profile">
            <div className="email">
              {viewProductData?.actual_price
                ? "Actual Price"
                : "Starting Price"}
            </div>
            <div className="input-outer">
              ₹{" "}
              {viewProductData?.actual_price
                ? viewProductData?.actual_price
                : viewProductData?.starting_price}
            </div>
          </div>
          {viewProductData?.discount_price && (
            <div className="common-profile">
              <div className="deviceUse">Discount Price</div>
              <div className="input-outer">
                ₹ {viewProductData?.discount_price}
              </div>
            </div>
          )}
          {viewProductData?.quantity > 0 && (
            <div className="common-profile">
              <div className="deviceUse">Product Stock (quantity)</div>
              <div className="input-outer">{viewProductData?.quantity}</div>
            </div>
          )}
          <div className="common-profile">
            <div className="deviceUse">Offer Name</div>
            <div className="input-outer">{viewProductData?.offer_name}</div>
          </div>
          <div className="common-profile">
            <div className="deviceUse">Description</div>
            <div className="input-outer">{viewProductData?.description}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AstromalProductView;
