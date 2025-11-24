import Image from "next/image";
import React from "react";

const AstromallShopView = ({ viewProductData, setViewProductStatus }) => {
console.log(viewProductData,"viewProductData");

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
                  viewProductData?.astroMallImg
                    ? process.env.NEXT_PUBLIC_WEBSITE_URL +
                      viewProductData?.astroMallImg
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
            <div className="deviceUse">Offer Name</div>
            <div className="input-outer">{viewProductData?.offer_name}</div>
          </div>
        
          <div className="common-profile">
            <div className="deviceUse">Offer Title</div>
            <div className="input-outer">{viewProductData?.offer_title}</div>
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

export default AstromallShopView;
