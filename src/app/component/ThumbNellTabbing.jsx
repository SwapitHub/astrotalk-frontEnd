import Image from "next/image";
import React, { useState } from "react";
import { useEffect } from "react";

const ThumbNellTabbing = ({ productDetailData }) => {
  const [tabbing, setTabbing] = useState();
  console.log(tabbing);

  useEffect(() => {
    setTabbing(productDetailData?.astroMallProductImg || "");
  }, [productDetailData]);

  return (
    <div className="product-images-left-inner">
      <div className="slider-left-nav">
        <div onClick={() => setTabbing(productDetailData?.astroMallProductImg)}>
          <Image
            width={100}
            height={100}
            src={
              process.env.NEXT_PUBLIC_WEBSITE_URL +
                productDetailData?.astroMallProductImg || "/user-icon-image.png"
            }
            alt="user-icon"
          />
        </div>
        {productDetailData?.images?.map((item) => (
          <div onClick={() => setTabbing(item?.url)}>
            <Image
              width={100}
              height={100}
              src={
                process.env.NEXT_PUBLIC_WEBSITE_URL + item?.url ||
                "/user-icon-image.png"
              }
              alt="user-icon"
            />
          </div>
        ))}
      </div>

      <div className="slider-right-img">
        <div className="slider-large-img">
          <Image
            width={100}
            height={100}
            src={tabbing?
              process.env.NEXT_PUBLIC_WEBSITE_URL + tabbing 
              :"/user-icon-image.png"
            }
            alt="user-icon"
          />
        </div>
      </div>
    </div>
  );
};

export default ThumbNellTabbing;
