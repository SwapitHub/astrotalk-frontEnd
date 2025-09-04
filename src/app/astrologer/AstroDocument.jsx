import React from "react";

export const AstroDocument = ({ registrationDetail }) => {
  return (
    <div className="astroDocument">
      <h2>Astrologer {registrationDetail?.name} Document</h2>
      <div className="main-doc">
        <div className="aadhar-card">
          <h3>Aadhar Card</h3>
          <a href={registrationDetail.aadhaarCard} target="_blank">
            <img
              src={registrationDetail.aadhaarCard}
              alt={registrationDetail?.name}
            />
          </a>
        </div>
        <div className="aadhar-card certificate">
          <h3>Certificate</h3>
          <a href={registrationDetail.certificate} target="_blank">
            <img
              src={registrationDetail.certificate}
              alt={registrationDetail?.name}
            />
          </a>
        </div>
      </div>
    </div>
  );
};
