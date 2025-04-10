"use client";
import { useState } from "react";
import AstrologerProfile from "./AstrologerProfile";
import AstrologerWallet from "./AstrologerWallet";
import DashBoardData_1 from "./DashBoardData_1";

const AstrologerHome = () => {
  const [updateButton, setUpdateButton] = useState(2);
  const [successMessageProfile, setSuccessMessageProfile] = useState();

  // useEffect(() => {
  //   if (updateButton !== 2 && successMessageProfile.message !== "success") {
  //     toast.warning("please complete the profile", {
  //       position: "top-right",
  //     });
  //   }
  // }, [updateButton]);

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
            </ul>
          </div>
          <div className="dashboard-right-content">
            {updateButton == 1 && <DashBoardData_1 />}

            {updateButton == 2 && (
              <AstrologerProfile
                successMessageProfile={successMessageProfile}
                setSuccessMessageProfile={setSuccessMessageProfile}
              />
            )}
              {updateButton == 3 && (
              <AstrologerWallet
                
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AstrologerHome;
