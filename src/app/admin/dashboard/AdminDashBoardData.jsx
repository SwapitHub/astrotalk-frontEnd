import Link from "next/link";
import React from "react";
import { FaRocketchat } from "react-icons/fa";
import { PiUserListDuotone } from "react-icons/pi";
import { SiLinuxprofessionalinstitute } from "react-icons/si";
import { TfiGallery } from "react-icons/tfi";
import secureLocalStorage from "react-secure-storage";
import { GrLanguage } from "react-icons/gr";
import { IoWalletSharp } from "react-icons/io5";
import { LiaSortAmountUpSolid } from "react-icons/lia";
import { RiLockPasswordLine } from "react-icons/ri";

const AdminDashBoardData = ({ setUpdateButton }) => {
  const totalUsersList = secureLocalStorage.getItem("totalUsersList");
  const totalAstroActive = secureLocalStorage.getItem("totalAstroActive");
  const totalAstroPending = secureLocalStorage.getItem("totalAstroPending");
  const totalTransactionsData = secureLocalStorage.getItem(
    "totalTransactionsData"
  );
  console.log(totalAstroPending);

  return (
    <div className="outer-home-dashboard">
      <div className="inner-home-dashboard">
        <div className="home-dashboard-heading">
          <h2>Dashboard</h2>
          <p>Astrotalk Admin Panel</p>
        </div>
        <ul>
          <li onClick={() => setUpdateButton("changePassword")}>
            <span>
              <RiLockPasswordLine />
            </span>
            <div className="inner-text">
              <span>Change Password</span>
            </div>
          </li>
          <li onClick={() => setUpdateButton(7)}>
            <span>
              <PiUserListDuotone />
            </span>
            <div className="inner-text">
              <span> User List</span>
              <span className="number">{totalUsersList}</span>
            </div>
          </li>
          <li onClick={() => setUpdateButton("pending")}>
            <span>
              <PiUserListDuotone />
            </span>
            <div className="inner-text">
              <span>AstroLoger Pending</span>
              <span className="number">{totalAstroPending}</span>
            </div>
          </li>
          <li onClick={() => setUpdateButton("active")}>
            <span>
              <PiUserListDuotone />
            </span>
            <div className="inner-text">
              <span>Astrologer Active</span>
              <span className="number">{totalAstroActive}</span>
            </div>
          </li>
          <li onClick={() => setUpdateButton("admin")}>
            <span>
              <IoWalletSharp />
            </span>
            <div className="inner-text">
              <span>Wallet Admin</span>
              <span className="number">{totalTransactionsData}</span>
            </div>
          </li>
          <li onClick={() => setUpdateButton("astrologer")}>
            <span>
              <IoWalletSharp />
            </span>
            <div className="inner-text">
              <span>Wallet Astrologer</span>
              <span className="number">{totalTransactionsData}</span>
            </div>
          </li>
          <li onClick={() => setUpdateButton("user")}>
            <span>
              <IoWalletSharp />
            </span>
            <div className="inner-text">
              <span>Wallet User</span>
              <span className="number">{totalTransactionsData}</span>
            </div>
          </li>
          <li onClick={() => setUpdateButton("Denomination")}>
            <span>
              <LiaSortAmountUpSolid />
            </span>
            <div className="inner-text">
              <span>Denomination Amount</span>
              {/* <span>123</span> */}
            </div>
          </li>
          <li onClick={() => setUpdateButton("language")}>
            <span>
              <GrLanguage />
            </span>
            <div className="inner-text">
              <span> Languages</span>
              {/* <span>123</span> */}
            </div>
          </li>
          <li onClick={() => setUpdateButton("profession")}>
            <span>
              <SiLinuxprofessionalinstitute />
            </span>
            <div className="inner-text">
              <span> Profession</span>
              {/* <span>123</span> */}
            </div>
          </li>
          <li onClick={() => setUpdateButton("ChatCommission")}>
            <span>
              <FaRocketchat />
            </span>
            <div className="inner-text">
              <span> Admin Chat Commission</span>
              {/* <span>123</span> */}
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashBoardData;
