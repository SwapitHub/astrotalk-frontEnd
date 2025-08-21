import Link from "next/link";
import React from "react";

export const AstroDocument = ({ registrationDetail }) => {
  return (
    <div className="astroDocument">
      <h2>Astrologer {registrationDetail?.name} Document</h2>
      <div className="main-doc">
        <div className="aadhar-card">
          <h3>Aadhar Card</h3>
          <Link href={registrationDetail?.aadhaarCard} target="_blank">
            <img
              src={registrationDetail?.aadhaarCard}
              alt={registrationDetail?.name}
            />
          </Link>
        </div>
        <div className="aadhar-card certificate">
          <h3>Certificate</h3>
          <Link href={registrationDetail?.certificate} target="_blank">
            <img
              src={registrationDetail?.certificate}
              alt={registrationDetail?.name}
            />
          </Link>
        </div>
      </div>
    </div>
  );
};
