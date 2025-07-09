"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import secureLocalStorage from "react-secure-storage";
import AdminDashBoardData from "./AdminDashBoardData";
import AdminWallet from "./AdminWallet";
import AstroLogerList from "./AstroLogerList";
import AstrologerPendingList from "./AstrologerPendingList";
import Denomination from "./Denomination";
import UserList from "./UserList";
import AddLanguage from "./AddLanguage";
import AddProfession from "./AddProfession";
import ChatCommission from "./ChatCommission";
import {
  MdOutlineDashboard,
  MdOutlineKeyboardArrowRight,
  MdOutlinePreview,
} from "react-icons/md";
import SlideToggle from "@/app/component/SlideToggle";
import DashboardHeader from "@/app/header/DashboardHeader";
import { PiUserListDuotone } from "react-icons/pi";
import { CiSettings, CiWallet } from "react-icons/ci";
import { TfiGallery } from "react-icons/tfi";
import { IoMdLogOut } from "react-icons/io";
import { TbBrandDenodo } from "react-icons/tb";
import { FaHeadSideCough, FaShoppingBag } from "react-icons/fa";
import ChangePassword from "./ChangePassword";
import { useGlobalContext } from "@/context/HomeContext";
import AstroMallShops from "./AstroMallShops";
import AstroMallShopProduct from "./AstroMallShopProduct";
import GemStoneProductGemJewelry from "./GemStoneProductGemJewelry";

const AdminHome = () => {
  const router = useRouter();
  const admin_id = secureLocalStorage.getItem("admin_id");
  const { updateButton, setUpdateButton } = useGlobalContext();
  const [astroListToggle, setAstroListToggle] = useState(false);
  const [adminWalletToggle, setAdminWalletToggle] = useState(false);
  const [adminSideSettingToggle, setAdminSideSettingToggle] = useState(false);
  const [astroShopeList, setAstroShopeList] = useState(false);
  const [toggleSlideMobile, setToggleSlideMobile] = useState(false);

  useEffect(() => {
    if (!admin_id) {
      router.push("/");
    }
  }, [admin_id]);

  const handleAdminLogOut = () => {
    secureLocalStorage.removeItem("admin_id");
    window.dispatchEvent(new Event("admin_id_updated"));
    router.push("/admin");
  };

  useEffect(() => {
    const className = "slider-opened";

    if (toggleSlideMobile) {
      document.body.classList.add(className);
    } else {
      document.body.classList.remove(className);
    }
  }, [toggleSlideMobile]);

  return (
    <main className="main-content">
      <DashboardHeader setToggleSlideMobile={setToggleSlideMobile} />
      <div className="dashboard-main-outer">
        <div className="container">
          <div className="dashboard-inner-main super-admin">
            <div className="dashboard-inner">
              <div className="dashboard-left-dashboard">
                <div
                  className="mobile-close-sidebar"
                  onClick={() => setToggleSlideMobile(false)}
                >
                  <span></span>
                  <span></span>
                </div>
                <div className="left-sidebar-logo">
                  <a href="#" title="">
                    <img src="/astrotalk-logo.webp" alt="Logo" />
                  </a>
                </div>
                <div className="dashboard-list">
                  <ul>
                    <li className={updateButton === 1 ? "active" : ""}>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setUpdateButton(1);
                          setToggleSlideMobile(false);
                        }}
                      >
                        <MdOutlineDashboard />
                        <span className="list-text">Dashboard</span>
                      </a>
                    </li>
                    <li
                      className={`${
                        updateButton === "active" || updateButton === "pending"
                          ? "active"
                          : ""
                      }`}
                    >
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setAstroListToggle(!astroListToggle);
                        }}
                      >
                        <PiUserListDuotone />
                        <span className="list-text">Astrologer List </span>
                        <span className="list-arrow">
                          <MdOutlineKeyboardArrowRight />
                        </span>
                      </a>
                      <SlideToggle isOpen={astroListToggle}>
                        <ul>
                          <li
                            className={
                              updateButton === "active" ? "active" : ""
                            }
                          >
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setUpdateButton("active");
                                setToggleSlideMobile(false);
                              }}
                            >
                              Active
                            </a>
                          </li>
                          <li
                            className={
                              updateButton === "pending" ? "active" : ""
                            }
                          >
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setUpdateButton("pending");
                                setToggleSlideMobile(false);
                              }}
                            >
                              Pending
                            </a>
                          </li>
                        </ul>
                      </SlideToggle>
                    </li>
                    <li
                      className={
                        updateButton === "admin" ||
                        updateButton === "astrologer" ||
                        updateButton === "user"
                          ? "active"
                          : ""
                      }
                    >
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setAdminWalletToggle(!adminWalletToggle);
                        }}
                      >
                        <CiWallet />
                        <span className="list-text">Wallet </span>
                        <span className="list-arrow">
                          <MdOutlineKeyboardArrowRight />
                        </span>
                      </a>
                      <SlideToggle isOpen={adminWalletToggle}>
                        <ul>
                          <li
                            className={updateButton === "admin" ? "active" : ""}
                          >
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setUpdateButton("admin");
                                setToggleSlideMobile(false);
                              }}
                            >
                              Admin
                            </a>
                          </li>
                          <li
                            className={
                              updateButton === "astrologer" ? "active" : ""
                            }
                          >
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setUpdateButton("astrologer");
                                setToggleSlideMobile(false);
                              }}
                            >
                              Astrologer
                            </a>
                          </li>
                          <li
                            className={updateButton === "user" ? "active" : ""}
                          >
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setUpdateButton("user");
                                setToggleSlideMobile(false);
                              }}
                            >
                              User
                            </a>
                          </li>
                        </ul>
                      </SlideToggle>
                    </li>
                    <li className={updateButton === 3 ? "active" : ""}>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setUpdateButton(3);
                        }}
                      >
                        <TbBrandDenodo />
                        <span className="list-text">Denomination</span>
                      </a>
                    </li>
                    <li
                      className={
                        updateButton === "language" ||
                        updateButton === "profession" ||
                        updateButton === "ChatCommission" ||
                        updateButton === "changePassword"
                          ? "active"
                          : ""
                      }
                    >
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setAdminSideSettingToggle(!adminSideSettingToggle);
                        }}
                      >
                        <CiSettings />
                        <span className="list-text">Site Setting </span>
                        <span className="list-arrow">
                          <MdOutlineKeyboardArrowRight />
                        </span>
                      </a>
                      <SlideToggle isOpen={adminSideSettingToggle}>
                        <ul>
                          <li
                            className={
                              updateButton === "language" ? "active" : ""
                            }
                          >
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setUpdateButton("language");
                                setToggleSlideMobile(false);
                              }}
                            >
                              Add Languages
                            </a>
                          </li>
                          <li
                            className={
                              updateButton === "profession" ? "active" : ""
                            }
                          >
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setUpdateButton("profession");
                                setToggleSlideMobile(false);
                              }}
                            >
                              Add Profession
                            </a>
                          </li>
                          <li
                            className={
                              updateButton === "ChatCommission" ? "active" : ""
                            }
                          >
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setUpdateButton("ChatCommission");
                                setToggleSlideMobile(false);
                              }}
                            >
                              Chat Commission
                            </a>
                          </li>
                          <li
                            className={
                              updateButton === "changePassword" ? "active" : ""
                            }
                          >
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setUpdateButton("changePassword");
                                setToggleSlideMobile(false);
                              }}
                            >
                              Change Password
                            </a>
                          </li>
                        </ul>
                      </SlideToggle>
                    </li>

                    <li
                      className={updateButton === "astroShop" ? "active" : ""}
                    >
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setAstroShopeList(!astroShopeList);
                        }}
                      >
                        <FaShoppingBag />
                        <span className="list-text">Astromall Shop </span>
                        <span className="list-arrow">
                          <MdOutlineKeyboardArrowRight />
                        </span>
                      </a>
                      <SlideToggle isOpen={astroShopeList}>
                        <ul>
                          <li
                            className={
                              updateButton === "astroShop" ? "active" : ""
                            }
                          >
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setUpdateButton("astroShop");
                                setToggleSlideMobile(false);
                              }}
                            >
                              <span className="list-text">Add Astro Shop</span>
                            </a>
                          </li>

                          <li
                            className={
                              updateButton === "astroShopProduct"
                                ? "active"
                                : ""
                            }
                          >
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setUpdateButton("astroShopProduct");
                                setToggleSlideMobile(false);
                              }}
                            >
                              <span className="list-text">
                                Add Astro Shop Product
                              </span>
                            </a>
                          </li>

                          <li
                            className={
                              updateButton === "astroShopGemJewelry"
                                ? "active"
                                : ""
                            }
                          >
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setUpdateButton("astroShopGemJewelry");
                                setToggleSlideMobile(false);
                              }}
                            >
                              <span className="list-text">
                                Add GemStone Product Jewelry
                              </span>
                            </a>
                          </li>
                        </ul>
                      </SlideToggle>
                    </li>

                    <li className={updateButton === 6 ? "active" : ""}>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setUpdateButton(6);
                          setToggleSlideMobile(false);
                        }}
                      >
                        <FaHeadSideCough />
                        <span className="list-text">Id Proof</span>
                      </a>
                    </li>
                    <li className={updateButton === 7 ? "active" : ""}>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setUpdateButton(7);
                          setToggleSlideMobile(false);
                        }}
                      >
                        <PiUserListDuotone />
                        <span className="list-text">User List</span>
                      </a>
                    </li>
                    <li>
                      {admin_id && (
                        <span onClick={handleAdminLogOut}>
                          <IoMdLogOut />
                          <span className="list-text">Log out admin</span>
                        </span>
                      )}
                    </li>
                  </ul>
                </div>
              </div>

              <div className="dashboard-right-content">
                {updateButton === 1 && (
                  <AdminDashBoardData setUpdateButton={setUpdateButton} />
                )}
                {updateButton === "active" && <AstroLogerList />}
                {updateButton === "pending" && <AstrologerPendingList />}
                {updateButton === 7 && <UserList />}
                {updateButton === 3 && <Denomination />}
                {updateButton === "astroShop" && <AstroMallShops />}
                {updateButton === "astroShopGemJewelry" && <GemStoneProductGemJewelry/>}
                {updateButton === "astroShopProduct" && (
                  <AstroMallShopProduct />
                )}
                {updateButton === "language" && <AddLanguage />}
                {updateButton === "profession" && <AddProfession />}
                {updateButton === "ChatCommission" && <ChatCommission />}
                {updateButton === "changePassword" && <ChangePassword />}

                {["user", "astrologer", "admin"].includes(updateButton) && (
                  <AdminWallet updateButton={updateButton} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminHome;
