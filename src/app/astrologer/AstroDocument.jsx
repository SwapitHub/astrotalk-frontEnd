import Image from "next/image";
import React from "react";

export const AstroDocument = ({ registrationDetail }) => {
  return (
    <div className="astroDocument">
      <h2>Astrologer {registrationDetail?.name} Document</h2>
      <div className="main-doc">
        <div className="aadhar-card">
          <h3>Aadhar Card</h3>
          <a href={registrationDetail?.aadhaarCard} target="_blank">
            <Image
              width={100}
              height={100}
              src={process.env.NEXT_PUBLIC_WEBSITE_URL + registrationDetail?.aadhaarCard || "/user-icon-image.png"}
              alt="certificate"
            />
           
          </a>
        </div>
        <div className="aadhar-card certificate">
          <h3>Certificate</h3>
          <a href={registrationDetail?.certificate} target="_blank">
            <Image
              width={100}
              height={100}
              src={process.env.NEXT_PUBLIC_WEBSITE_URL + registrationDetail?.certificate || "/user-icon-image.png"}
              alt="certificate"
            />
            
          </a>
        </div>
      </div>
    </div>
  );
};
