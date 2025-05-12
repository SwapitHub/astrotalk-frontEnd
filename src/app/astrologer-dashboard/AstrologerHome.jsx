"use client";
import { useEffect, useState } from "react";
import AstrologerProfile from "./AstrologerProfile";
import AstrologerWallet from "./AstrologerWallet";
import DashBoardData_1 from "./DashBoardData_1";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import Link from "next/link";
import DashboardHeader from "../header/DashboardHeader";
import { useRouter } from "next/navigation";

const AstrologerHome = () => {
  const astrologerPhone = secureLocalStorage.getItem("astrologer-phone");
  const router = useRouter();
  const [updateButton, setUpdateButton] = useState(2);
  const [successMessageProfile, setSuccessMessageProfile] = useState();
  const [astrologerData, setAstrologerData] = useState("");

  useEffect(() => {
    if (!astrologerPhone) {
      router.push("/");
    }
  }, [astrologerPhone]);

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
      await fetch(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/update-business-profile/${mobileNumber}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            freeChatStatus: isChecked,
          }),
        }
      );

      console.log("freeChatStatus updated to", isChecked);
    } catch (error) {
      console.error("Failed to update freeChatStatus:", error);
    }
  };

  const astroLogerLogout = async () => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/update-astro-status-by-mobile/${astrologerPhone}`,
        {
          profileStatus: false,
        }
      );
      console.log(response);

      if (response.data.message == "Success") {
        secureLocalStorage.removeItem("astrologer-phone");
        router.push("/");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
      console.log("Astrologer status updated:", response.data);
      // update order history
      const updateList = await axios.put(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/userId-to-astrologer-astro-list-update`,
        {
          mobileNumber: astrologerPhone,
          profileStatus: false,
        }
      );
      console.log("update order history", updateList);
    } catch (error) {
      console.error(
        "Failed to update astrologer status:",
        error.response?.data?.error || error.message
      );
    }
  };
  return (
    <main className="main-content">
      <DashboardHeader/>
      <div class="dashboard-main-outer">
        <div className="container">
          <div className="dashboard-inner-main">
            <div className="dashboard-inner">
              
                <div className="dashboard-left-dashboard">
                  <div className="left-sidebar-logo">
                    <a href="#" title="">
                      <img src="/astrotalk-logo.webp" alt="Logo" />
                    </a>
                  </div>
                  <div className="dashboard-list">
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
                            <input
                              type="checkBox"
                              name={astrologerPhone}
                              onClick={handleUpdateStatus}
                              defaultChecked={astrologerData.freeChatStatus}
                            />
                          </button>
                        </li>
                      )}

                      <li>
                        <button onClick={astroLogerLogout}>
                          Log Out Astrologer
                        </button>
                      </li>
                    </ul>
                  </div>
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
      </div>
    </main>
  );
};

export default AstrologerHome;
