"use client";
import { useEffect, useState } from "react";
import AstrologerProfile from "./AstrologerProfile";
import AstrologerWallet from "./AstrologerWallet";
import DashBoardData_1 from "./DashBoardData_1";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import Link from "next/link";

const AstrologerHome = () => {
  const astrologerPhone = secureLocalStorage.getItem("astrologer-phone");
  const [updateButton, setUpdateButton] = useState(2);
  const [successMessageProfile, setSuccessMessageProfile] = useState();
  const [astrologerData, setAstrologerData] = useState("");

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/astrologer-businessProfile/${astrologerPhone}`
      )
      .then((response) => {
        setAstrologerData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [astrologerPhone]);
  // useEffect(() => {
  //   if (updateButton !== 2 && successMessageProfile.message !== "success") {
  //     toast.warning("please complete the profile", {
  //       position: "top-right",
  //     });
  //   }
  // }, [updateButton]);
  const handleUpdateStatus = async (e) => {
    const mobileNumber = e.target.name;
    const isChecked = e.target.checked;
  
    try {
      await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/update-business-profile/${mobileNumber}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ freeChatStatus: isChecked }),
      });
  
      console.log("freeChatStatus updated to", isChecked);
    } catch (error) {
      console.error("Failed to update freeChatStatus:", error);
    }
  };
  

  return (
    <div className="container">
      <div className="dashboard-inner-main">
        <div className="dashboard-inner">
          <div className="dashboard-left-dashboard">
            <ul>
              <li>
                <a
                  href="#"
                  title="menu"
                  onClick={(e) => {
                    e.preventDefault();
                    setUpdateButton(1);
                  }}
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="#"
                  title="menu"
                  onClick={(e) => {
                    e.preventDefault();
                    setUpdateButton(2);
                  }}
                >
                  Manage Profile
                </a>
              </li>
              <li>
                <a
                  href="#"
                  title="menu"
                  onClick={(e) => {
                    e.preventDefault();
                    setUpdateButton(3);
                  }}
                >
                  Wallet
                </a>
              </li>
              <li>
                <a
                  href="#"
                  title="menu"
                  onClick={(e) => {
                    e.preventDefault();
                    setUpdateButton(4);
                  }}
                >
                  Gallery
                </a>
              </li>
              <li>
                <a
                  href="#"
                  title="menu"
                  onClick={(e) => {
                    e.preventDefault();
                    setUpdateButton(5);
                  }}
                >
                  My Review
                </a>
              </li>
              <li>
                <a
                  href="#"
                  title="menu"
                  onClick={(e) => {
                    e.preventDefault();
                    setUpdateButton(6);
                  }}
                >
                  Id Proof
                </a>
              </li>

              {astrologerData?.profileStatus == true && (
                <li>
                  <button>
                    <label>Are you Available for free chat </label>
                    <input type="checkBox" name={astrologerPhone} onClick={handleUpdateStatus} 
                    defaultChecked={astrologerData.freeChatStatus} 
                    />
                  </button>
                </li>
              )}
            </ul>
          </div>
          <div className="dashboard-right-content">
            {updateButton == 1 && <DashBoardData_1 />}

            {updateButton == 2 && (
              <AstrologerProfile
                successMessageProfile={successMessageProfile}
                setSuccessMessageProfile={setSuccessMessageProfile}
                astrologerData={astrologerData}
              />
            )}
            {updateButton == 3 && <AstrologerWallet />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AstrologerHome;
