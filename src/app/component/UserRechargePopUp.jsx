"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const UserRecharge = ({ setShowRecharge, astroMobileNum }) => {
  const [AstroData, setAstroData] = useState()
  const router = useRouter();
  const handleRecharge = () => {
    router.push("/add-wallet-money/price-list");
    setShowRecharge(false)
  };

  useEffect(() => {
    axios.get(
      `${process.env.NEXT_PUBLIC_WEBSITE_URL}/astrologer-businessProfile/${astroMobileNum}`)
      .then((res)=>{
        setAstroData(res.data)
      })
      .catch((err)=>{
        console.log(err);
      })

  }, []);

  return (
    <div className="parent-recharge-popup">
    <div className="main-recharge-popup">
      <div className="recharge-popup">
        {/* <button className="cross" onClick={() => setShowRecharge(false)}>
          X
        </button> */}
        <p>
          Minimum balance of 2 minutes (₹ {AstroData?.charges * 2}.0) is required to start chat with   
            { } {AstroData?.name}
        </p>
        <div className="button">
          <button onClick={() => setShowRecharge(false)}>Cancel</button>
          <button onClick={handleRecharge}>Recharge</button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default UserRecharge;
