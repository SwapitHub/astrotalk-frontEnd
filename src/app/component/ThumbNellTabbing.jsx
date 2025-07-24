import React, { useState } from "react";
import { useEffect } from "react";

const ThumbNellTabbing = ({productDetailData}) => {
  const [tabbing, setTabbing] = useState();

useEffect(()=>{
  setTabbing(productDetailData?.astroMallProductImg)
},[productDetailData])

  return (
    <div className="product-images-left-inner">
      <div className="slider-left-nav">
        <div onClick={() => setTabbing(productDetailData?.astroMallProductImg)}>
          <img src={productDetailData?.astroMallProductImg} alt=""/>
        </div>
        <div onClick={() => setTabbing("https://d1gcna0o0ldu5v.cloudfront.net/fit-in/250x250/images/e8b22391-ca96-43b3-a527-39c0f661cc93.jpg")}>
          <img src="https://d1gcna0o0ldu5v.cloudfront.net/fit-in/250x250/images/e8b22391-ca96-43b3-a527-39c0f661cc93.jpg" alt=""/>
        </div>
        <div onClick={() => setTabbing("https://d1gcna0o0ldu5v.cloudfront.net/fit-in/250x250/images/605fc35f-b07c-48bb-a3d2-2c836d6da75c.jpg")}>
          <img src="https://d1gcna0o0ldu5v.cloudfront.net/fit-in/250x250/images/605fc35f-b07c-48bb-a3d2-2c836d6da75c.jpg" alt=""/>
        </div>
      </div>
      <div className="slider-right-img">
        <div className="slider-large-img"><img src={tabbing}/></div>
      </div>
    </div>
  );
};

export default ThumbNellTabbing;
