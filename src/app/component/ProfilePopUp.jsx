import { useRouter } from "next/navigation";
import React from "react";
import secureLocalStorage from "react-secure-storage";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { IoIosCall } from "react-icons/io";
import { useGlobalContext } from "@/context/HomeContext";
import Cookies from "js-cookie";

const ProfilePopUp = ({ astroDetailData }) => {
  const router = useRouter();
  const { setUpdateButton } = useGlobalContext();
  const [astrologerPhone, setAstrologerPhone] = useState();

  useEffect(() => {
    const astrologerPhones = Cookies.get("astrologer-phone");
    setAstrologerPhone(astrologerPhones);
  }, []);

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
        Cookies.remove("astrologer-phone");
        sessionStorage.clear(); // Clear entire session storage
        localStorage.clear();
        router.push("/");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
      // update order history
      const updateList = await axios.put(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/userId-to-astrologer-astro-list-update`,
        {
          mobileNumber: astrologerPhone,
          profileStatus: false,
        }
      );
    } catch (error) {
      console.error(
        "Failed to update astrologer status:",
        error.response?.data?.error || error.message
      );
    }
  };

  const openProfile = () => {
    setUpdateButton(2);
  };
  return (
    <>
      <ul className="profile-dropdown onhover-show-div">
        <>
          <li className="name">
            <Link href="#">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="feather feather-user"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              {astroDetailData?.name}
            </Link>
          </li>
          <li className="mobile-no">
            <Link href="#">
              <IoIosCall />
              {astroDetailData?.mobileNumber}
            </Link>
          </li>
        </>

        <li>
          <Link href="#" onClick={openProfile}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="feather feather-user"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Profile
          </Link>
        </li>

        <li>
          <button onClick={astroLogerLogout}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="feather feather-log-out"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>

            <span>Astrologer Logout </span>
          </button>
        </li>
      </ul>
    </>
  );
};

export default ProfilePopUp;
