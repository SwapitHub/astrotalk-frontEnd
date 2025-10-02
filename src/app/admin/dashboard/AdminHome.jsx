"use client";
import SlideToggle from "@/app/component/SlideToggle";
import AdminHeader from "@/app/header/AdminHeader";
import { useGlobalContext } from "@/context/HomeContext";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CiSettings, CiWallet } from "react-icons/ci";
import { FaBlog, FaShoppingBag } from "react-icons/fa";
import { GiPayMoney } from "react-icons/gi";
import { IoIosHome, IoMdLogOut } from "react-icons/io";
import {
  MdOutlineDashboard,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { PiUserListDuotone } from "react-icons/pi";
import secureLocalStorage from "react-secure-storage";
import AddLanguage from "./AddLanguage";
import AddProfession from "./AddProfession";
import AdminDashBoardData from "./AdminDashBoardData";
import AdminShopProductWallet from "./AdminShopProductWallet";
import AdminShopWallet from "./AdminShopPujaWallet";
import AdminWallet from "./AdminWallet";
import AstroLogerList from "./astrologerData/AstroLogerList";
import AstrologerPendingList from "./astrologerData/AstrologerPendingList";
import AstroMallShopProduct from "./astrologerData/AstroMallShopProduct";
import AstroMallShops from "./astrologerData/AstroMallShops";
import AddBlogs from "./blogs/AddBlogs";
import AddBlogsCategory from "./blogs/AddBlogsCategory";
import AllBlogs from "./blogs/AllBlogs";
import ChangePassword from "./ChangePassword";
import ChatCommission from "./ChatCommission";
import Denomination from "./Denomination";
import GemStoneProductGemJewelry from "./GemStoneProductGemJewelry";
import AddFooter from "./home/AddFooter";
import BannerHome from "./home/BannerHome";
import PaymentWithdrawRequest from "./PaymentWithdrawRequest";
import SeminarRegistration from "./SeminarRegistration";
import SeoMetaData from "./SeoMetaData";
import UserList from "./UserList";
import UserAdminWallet from "./wallet/UserAdminWallet";

const AdminHome = () => {
  const router = useRouter();
  const admin_id = Cookies.get("admin_id");
  const { updateButton, setUpdateButton } = useGlobalContext();
  const [toggleSlideMobile, setToggleSlideMobile] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    if (!admin_id) {
      router.push("/");
    }
  }, [admin_id]);

  const handleAdminLogOut = () => {
    secureLocalStorage.removeItem("admin_id");
    Cookies.remove("admin_id");
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
  const handleToggleSection = (sectionName) => {
    setOpenFaq((prev) => (prev === sectionName ? null : sectionName));
  };

  return (
    <main className="main-content">
      <AdminHeader setToggleSlideMobile={setToggleSlideMobile} />
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
                    <img src="/logo.png" alt="Logo" />
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
                      className={
                        updateButton === "PaymentWithdrawRequest"
                          ? "active"
                          : ""
                      }
                    >
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setUpdateButton("PaymentWithdrawRequest");
                          setToggleSlideMobile(false);
                        }}
                      >
                        <GiPayMoney />
                        <span className="list-text">
                          Payment Withdraw Request
                        </span>
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
                          handleToggleSection("AstrologerLists");
                        }}
                      >
                        <PiUserListDuotone />
                        <span className="list-text">Astrologer List </span>
                        <span className="list-arrow">
                          <MdOutlineKeyboardArrowRight />
                        </span>
                      </a>
                      <SlideToggle isOpen={openFaq == "AstrologerLists"}>
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
                          handleToggleSection("ChattingWallet");
                        }}
                      >
                        <CiWallet />
                        <span className="list-text">Chatting Wallet </span>
                        <span className="list-arrow">
                          <MdOutlineKeyboardArrowRight />
                        </span>
                      </a>
                      <SlideToggle isOpen={openFaq == "ChattingWallet"}>
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

                    <li
                      className={
                        updateButton === "shop-admin" ||
                        updateButton === "shop-ProductWallet" ||
                        updateButton === "shop-user"
                          ? "active"
                          : ""
                      }
                    >
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleToggleSection("ShoppingWallet");
                        }}
                      >
                        <CiWallet />
                        <span className="list-text">Order Detail </span>
                        <span className="list-arrow">
                          <MdOutlineKeyboardArrowRight />
                        </span>
                      </a>
                      <SlideToggle isOpen={openFaq == "ShoppingWallet"}>
                        <ul>
                          <li
                            className={
                              updateButton === "shop-admin" ? "active" : ""
                            }
                          >
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setUpdateButton("shop-admin");
                                setToggleSlideMobile(false);
                              }}
                            >
                              Shop puja order
                            </a>
                          </li>
                          <li
                            className={
                              updateButton === "shop-ProductWallet"
                                ? "active"
                                : ""
                            }
                          >
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setUpdateButton("shop-ProductWallet");
                                setToggleSlideMobile(false);
                              }}
                            >
                              Shop product order
                            </a>
                          </li>
                          {/* <li
                            className={
                              updateButton === "shop-user" ? "active" : ""
                            }
                          >
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setUpdateButton("shop-user");
                                setToggleSlideMobile(false);
                              }}
                            >
                              Shop User
                            </a>
                          </li> */}
                        </ul>
                      </SlideToggle>
                    </li>

                    <li
                      className={
                        updateButton === "footer" ||
                        updateButton === "home-banner"
                          ? "active"
                          : ""
                      }
                    >
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleToggleSection("HomeContent");
                        }}
                      >
                        <IoIosHome />

                        <span className="list-text">Home Content</span>
                        <span className="list-arrow">
                          <MdOutlineKeyboardArrowRight />
                        </span>
                      </a>
                      <SlideToggle isOpen={openFaq == "HomeContent"}>
                        <ul>
                          <li
                            className={
                              updateButton === "footer" ? "active" : ""
                            }
                          >
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setUpdateButton("footer");
                                setToggleSlideMobile(false);
                              }}
                            >
                              Footer Content
                            </a>
                          </li>
                          <li
                            className={
                              updateButton === "home-banner" ? "active" : ""
                            }
                          >
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setUpdateButton("home-banner");
                                setToggleSlideMobile(false);
                              }}
                            >
                              Home Banner
                            </a>
                          </li>
                        </ul>
                      </SlideToggle>
                    </li>

                    <li
                      className={
                        updateButton === "language" ||
                        updateButton === "profession" ||
                        updateButton === "ChatCommission" ||
                        updateButton === "changePassword" ||
                        updateButton === "Denomination" ||
                        updateButton === "seminar" ||
                        updateButton === "seoMetaData"
                          ? "active"
                          : ""
                      }
                    >
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleToggleSection("SiteSettings");
                        }}
                      >
                        <CiSettings />
                        <span className="list-text">Site Settings </span>
                        <span className="list-arrow">
                          <MdOutlineKeyboardArrowRight />
                        </span>
                      </a>
                      <SlideToggle isOpen={openFaq == "SiteSettings"}>
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
                              updateButton === "Denomination" ? "active" : ""
                            }
                          >
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setUpdateButton("Denomination");
                                setToggleSlideMobile(false);
                              }}
                            >
                              Denomination Amount
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
                              All Commissions
                            </a>
                          </li>
                          <li
                            className={
                              updateButton === "seoMetaData" ? "active" : ""
                            }
                          >
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setUpdateButton("seoMetaData");
                                setToggleSlideMobile(false);
                              }}
                            >
                              SEO Meta Data
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
                          <li
                            className={
                              updateButton === "seminar" ? "active" : ""
                            }
                          >
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setUpdateButton("seminar");
                                setToggleSlideMobile(false);
                              }}
                            >
                              Seminar Registration
                            </a>
                          </li>
                        </ul>
                      </SlideToggle>
                    </li>

                    <li
                      className={
                        updateButton === "astroShop" ||
                        updateButton === "astroShopProduct" ||
                        updateButton === "astroShopGemJewelry"
                          ? "active"
                          : ""
                      }
                    >
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();

                          handleToggleSection("AstromallShop");
                        }}
                      >
                        <FaShoppingBag />
                        <span className="list-text">Astromall Shop </span>
                        <span className="list-arrow">
                          <MdOutlineKeyboardArrowRight />
                        </span>
                      </a>
                      <SlideToggle isOpen={openFaq == "AstromallShop"}>
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
                          {/* <li
                            className={
                              updateButton === "spiritual-services" ? "active" : ""
                            }
                          >
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setUpdateButton("spiritual-services");
                                setToggleSlideMobile(false);
                              }}
                            >
                              Add Spiritual Services
                            </a>
                          </li> */}
                        </ul>
                      </SlideToggle>
                    </li>

                    <li
                      className={
                        updateButton === "AllBlogs" ||
                        updateButton === "AddBlogs" ||
                        updateButton === "AddBlogsCategory"
                          ? "active"
                          : ""
                      }
                    >
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();

                          handleToggleSection("Blogs");
                        }}
                      >
                        <FaBlog />
                        <span className="list-text">Blogs</span>
                        <span className="list-arrow">
                          <MdOutlineKeyboardArrowRight />
                        </span>
                      </a>
                      <SlideToggle isOpen={openFaq == "Blogs"}>
                        <ul>
                          <li
                            className={
                              updateButton === "AllBlogs" ? "active" : ""
                            }
                          >
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setUpdateButton("AllBlogs");
                                setToggleSlideMobile(false);
                              }}
                            >
                              <span className="list-text">All Blogs</span>
                            </a>
                          </li>

                          <li
                            className={
                              updateButton === "AddBlogs" ? "active" : ""
                            }
                          >
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setUpdateButton("AddBlogs");
                                setToggleSlideMobile(false);
                              }}
                            >
                              <span className="list-text">Add Blogs</span>
                            </a>
                          </li>

                          <li
                            className={
                              updateButton === "AddBlogsCategory"
                                ? "active"
                                : ""
                            }
                          >
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setUpdateButton("AddBlogsCategory");
                                setToggleSlideMobile(false);
                              }}
                            >
                              <span className="list-text">
                                Add Blogs Category
                              </span>
                            </a>
                          </li>
                        </ul>
                      </SlideToggle>
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

                {updateButton === "PaymentWithdrawRequest" && (
                  <PaymentWithdrawRequest setUpdateButton={setUpdateButton} />
                )}
                {updateButton === "active" && <AstroLogerList />}
                {updateButton === "pending" && <AstrologerPendingList />}
                {updateButton === 7 && <UserList />}
                {updateButton === "Denomination" && <Denomination />}
                {updateButton === "astroShop" && <AstroMallShops />}
                {updateButton === "astroShopGemJewelry" && (
                  <GemStoneProductGemJewelry />
                )}
                {updateButton === "astroShopProduct" && (
                  <AstroMallShopProduct />
                )}
                {updateButton === "AddBlogsCategory" && <AddBlogsCategory />}
                {updateButton === "AddBlogs" && <AddBlogs />}
                {updateButton === "AllBlogs" && <AllBlogs />}

                {updateButton === "language" && <AddLanguage />}
                {updateButton === "profession" && <AddProfession />}
                {updateButton === "ChatCommission" && <ChatCommission />}
                {updateButton === "changePassword" && <ChangePassword />}
                {updateButton === "home-banner" && <BannerHome />}
                {updateButton === "footer" && <AddFooter />}
                {updateButton === "seoMetaData" && <SeoMetaData />}
                {updateButton === "seminar" && <SeminarRegistration />}
                {updateButton === "user" && <UserAdminWallet />}


                {[ "astrologer", "admin"].includes(updateButton) && (
                  <AdminWallet updateButton={updateButton} />
                )}
                {["shop-user", "shop-admin"].includes(updateButton) && (
                  <AdminShopWallet updateButton={updateButton} />
                )}
                {updateButton === "shop-ProductWallet" && (
                  <AdminShopProductWallet updateButton={updateButton} />
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
