"use client";
import React, { useEffect, useState } from "react";
import AstroLogerList from "./AstroLogerList";
import AdminDashBoardData from "./AdminDashBoardData";
import axios from "axios";
import AstrologerPendingList from "./AstrologerPendingList";
import UserList from "./UserList";
import Denomination from "./Denomination";
import AdminWallet from "./AdminWallet";

const AdminHome = () => {
  const [updateButton, setUpdateButton] = useState(1);
  const [astroListToggle, setAstroListToggle] = useState(false);
  const [adminWalletToggle, setAdminWalletToggle] = useState(false);

  return (
    <div className="container">
      <div className="dashboard-inner-main super-admin">
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
                    setAstroListToggle(!astroListToggle);
                  }}
                >
                  Astrologer List
                </a>
                {astroListToggle && (
                  <ul>
                    <li>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setUpdateButton("active");
                        }}
                      >
                        Active
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setUpdateButton("pending");
                        }}
                      >
                        Pending
                      </a>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <a
                  href="#"
                  title="menu"
                  onClick={(e) => {
                    e.preventDefault();
                    setAdminWalletToggle(!adminWalletToggle);
                  }}
                >
                  Wallet
                </a>
                {adminWalletToggle && (
                  <ul>
                    <li>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setUpdateButton("admin");
                        }}
                      >
                        Admin
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setUpdateButton("astrologer");
                        }}
                      >
                        Astrologer
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setUpdateButton("user");
                        }}
                      >
                        User
                      </a>
                    </li>
                  </ul>
                )}
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
                  Denomination
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
              <li>
                <a
                  href="#"
                  title="menu"
                  onClick={(e) => {
                    e.preventDefault();
                    setUpdateButton(7);
                  }}
                >
                  user List
                </a>
              </li>
            </ul>
          </div>
          <div className="dashboard-right-content">
            {updateButton == 1 && <AdminDashBoardData />}

            {updateButton == "active" && <AstroLogerList />}
            {updateButton == "pending" && <AstrologerPendingList />}
            {updateButton == 7 && <UserList />}
            {updateButton == 3 && <Denomination />}
            {(updateButton == "user" || updateButton == "astrologer" || updateButton == "admin") && (<AdminWallet updateButton={updateButton}/>)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
