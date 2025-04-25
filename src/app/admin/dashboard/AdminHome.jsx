"use client";
import { useEffect, useState } from "react";
import AdminDashBoardData from "./AdminDashBoardData";
import AdminWallet from "./AdminWallet";
import AstroLogerList from "./AstroLogerList";
import AstrologerPendingList from "./AstrologerPendingList";
import Denomination from "./Denomination";
import UserList from "./UserList";
import {  useRouter } from "next/navigation";
import secureLocalStorage from "react-secure-storage";
import SideSetting from "./AddLanguage";
import AddLanguage from "./AddLanguage";
import AddProfession from "./AddProfession";
import ChatCommission from "./ChatCommission";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

const AdminHome = () => {
 const router = useRouter()
  
const admin_id = secureLocalStorage.getItem("admin_id");

  const [updateButton, setUpdateButton] = useState(1);
  const [astroListToggle, setAstroListToggle] = useState(false);
  const [adminWalletToggle, setAdminWalletToggle] = useState(false);
  const [adminSideSettingToggle, setAdminSideSettingToggle] = useState(false);

  useEffect(()=>{
    if(!admin_id){
      router.push("/")
    }
  },[admin_id])
  const handleAdminLogOut = () => {
    secureLocalStorage.removeItem("admin_id");

    // Notify other parts of the app
    window.dispatchEvent(new Event("admin_id_updated"));

    // Redirect
    router.push("/admin");
  };
  
  return (
    <div className="container">
     
      <div className="dashboard-inner-main super-admin">
        <div className="dashboard-inner">
          <div className="dashboard-left-dashboard">
            <ul>
              <li className={updateButton==1?"active" : ""}>
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
                  Astrologer List <span><MdOutlineKeyboardArrowRight /></span>
                </a>
                {astroListToggle && (
                  <ul>
                    <li className={updateButton=="active"?"active" : ""}>
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
                    <li className={updateButton=="pending"?"active" : ""}>
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
                  Wallet <span><MdOutlineKeyboardArrowRight /></span>
                </a>
                {adminWalletToggle && (
                  <ul>
                    <li className={updateButton=="admin"?"active" : ""}>
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
                    <li className={updateButton=="astrologer"?"active" : ""}>
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
                    <li className={updateButton=="user"?"active" : ""}>
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
              <li className={updateButton==3?"active" : ""}>
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
                    setAdminSideSettingToggle(!adminSideSettingToggle);
                  }}
                >
                 Site Setting <span><MdOutlineKeyboardArrowRight /></span>
                </a>
                {adminSideSettingToggle && (
                  <ul>
                    <li className={updateButton=="language"?"active" : ""}>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setUpdateButton("language");
                        }}
                      >
                        Add Languages
                      </a>
                    </li>
                    <li className={updateButton=="profession"?"active" : ""}>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setUpdateButton("profession");
                        }}
                      >
                        Add Profession
                      </a>
                    </li>
                    <li  className={updateButton=="ChatCommission"?"active" : ""}>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setUpdateButton("ChatCommission");
                        }}
                      >
                        Chat Commission
                      </a>
                    </li>
                  </ul>
                )}
              </li>
              <li  className={updateButton==4?"active" : ""}>
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
              <li  className={updateButton==5?"active" : ""}>
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
              <li className={updateButton==6?"active" : ""}>
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
              <li className={updateButton==7 ? "active" : ""}>
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
              <li>
              {admin_id && (
            <button onClick={handleAdminLogOut}>Log out admin</button>
          )}
              </li>
            </ul>
          </div>
          <div className="dashboard-right-content">
            {updateButton == 1 && <AdminDashBoardData />}

            {updateButton == "active" && <AstroLogerList />}
            {updateButton == "pending" && <AstrologerPendingList />}
            {updateButton == 7 && <UserList />}
            {updateButton == 3 && <Denomination />}
            {updateButton == "language" && <AddLanguage />}
            {updateButton == "profession" && <AddProfession />}
            {updateButton == "ChatCommission" && <ChatCommission />}
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
