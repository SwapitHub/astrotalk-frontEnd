import axios from "axios";
import React, { useEffect, useState } from "react";

const AstroDetail = ({ astroMobileNumber, setAddActiveClass }) => {
  const [astroDetailData, setAstroDetail] = useState();

  const astrologerDetail = async (astroMobileNumber) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/astrologer-businessProfile-detail/${astroMobileNumber}`
      );
      setAstroDetail(res.data);
      console.log(res, "astroDetailData");
    } catch (err) {
      console.log(err, "astro detail not found");
    }
  };
  useEffect(() => {
    if (astroMobileNumber) {
      astrologerDetail(astroMobileNumber);
    }
  }, [astroMobileNumber]);
  return (
    <div className="astro-detail-main">
      <span
        className="close"
        onClick={() => {
          setAddActiveClass(false);
        }}
      >
        X
      </span>
      <div className="img-data-outer">
        <div className="img">
          <img src={astroDetailData?.profileImage} alt="" />
        </div>
        <div className="data-astrologer">
          <p className="name">
            <span>Name: </span>
            <strong>{astroDetailData?.name}</strong>
          </p>
          <p className="name">
            <span>mobileNumber: </span>
            <strong>{astroDetailData?.mobileNumber}</strong>
          </p>
          <p className="exp">
            <span>Experience:</span>
            <strong>{astroDetailData?.experience}</strong>
          </p>
          <p className="charges">
            <span>Charges:</span>
            <strong>{astroDetailData?.charges}</strong>
          </p>
          
           <p>
            <span>Description:</span>
            <strong>{astroDetailData?.Description}</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AstroDetail;
