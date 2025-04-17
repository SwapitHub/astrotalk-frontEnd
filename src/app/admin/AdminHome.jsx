"use client";
import React, { useEffect, useState } from "react";
import AstroLogerList from "./AstroLogerList";
import AdminDashBoardData from "./AdminDashBoardData";
import axios from "axios";
import AstrologerPendingList from "./AstrologerPendingList";
import UserList from "./UserList";
import Denomination from "./Denomination";
import AdminWallet from "./AdminWallet";
import { usePathname } from "next/navigation";
import secureLocalStorage from "react-secure-storage";

const AdminHome = () => {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const adminSegment = segments[0]; // 'admin'
  console.log(adminSegment);

  const [updateButton, setUpdateButton] = useState(1);
  const [astroListToggle, setAstroListToggle] = useState(false);
  const [adminWalletToggle, setAdminWalletToggle] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const adminEmail = secureLocalStorage.getItem("adminEmail", email);
  const adminPassword = secureLocalStorage.getItem("adminPassword", password);
  // Show/hide popup based on adminSegment
  useEffect(() => {
    if (adminSegment == "admin" && !adminEmail && !adminPassword) {
      document.body.classList.add("admin-popup");
    } else {
      document.body.classList.remove("admin-popup");
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove("admin-popup");
    };
  }, [adminSegment, adminEmail, adminPassword]);

  const handleSubmit = async () => {
    try {
      // Fetch admin data
      const response = await fetch("http://localhost:8080/admin");
      if (!response.ok) throw new Error("Failed to fetch admin data");
      const admins = await response.json();
      console.log(admins);

      // Validate credentials
      if (admins[0]?.email === email && admins[0]?.password === password) {
        // Store in localStorage
        secureLocalStorage.setItem("adminEmail", email);
        secureLocalStorage.setItem("adminPassword", password);

        // Close popup
        document.body.classList.remove("admin-popup");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError(err.message);
      console.error("Login error:", err);
    }
  };

  if (!adminSegment) return null;
  return (
    <div className="container">
      <div className="outer-send-otp-main">
        <div className="man-input-filed-sec">
          <div className="admin-detail-popup ">
            <label>Admin Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Admin Password</label>
            <input
              type="text"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <div className="error-message">{error}</div>}
            <button onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      </div>
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
            {(updateButton == "user" ||
              updateButton == "astrologer" ||
              updateButton == "admin") && (
              <AdminWallet updateButton={updateButton} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
