import React, { useState } from "react";
import { useEffect } from "react";

const ThumbNellTabbing = ({ productDetailData }) => {
  const [tabbing, setTabbing] = useState();

  useEffect(() => {
    setTabbing(productDetailData?.astroMallProductImg);
  }, [productDetailData]);

  return (
    <div className="product-images-left-inner">
      <div className="slider-left-nav">
        <div  onClick={() => setTabbing(productDetailData?.astroMallProductImg)}>
            <img src={productDetailData?.astroMallProductImg} alt="" />

        </div>
        {productDetailData?.images?.map((item) => (
          <div onClick={() => setTabbing(item?.url)}>
            <img src={item?.url} alt="" />
          </div>
        ))}
      </div>

      <div className="slider-right-img">
        <div className="slider-large-img">
          <img src={tabbing} />
        </div>
      </div>
    </div>
  );
};

export default ThumbNellTabbing;
