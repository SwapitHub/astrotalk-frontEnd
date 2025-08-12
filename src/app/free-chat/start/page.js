"use client";

import { validateAstrologerForm } from "@/app/component/FormValidation";
import UserOtpLoginData from "@/app/component/UserOtpLoginData";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";

const StartUserName = () => {
  const router = useRouter();
  const [dateOfBirthAvailable, setDateOfBirthAvailable] = useState("no");
  const [otpPopUpDisplays, setOtpPopUpDisplays] = useState(false);
  const [datePhoneAvailable, setDatePhoneAvailable] = useState();
  const [errors, setErrors] = useState({});
  const [userMobile, setUserMobile] = useState();
  const [editName, setEditName] = useState();
  const [editGender, setEditGender] = useState();
  const [editDateOfBirth, setEditDateOfBirth] = useState();
  const [editLanguage, setEditLanguage] = useState();
  const [editPob, setEditPob] = useState();

  console.log(datePhoneAvailable);
const todayDate = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/user-login-detail/${userMobile}`
        );
        setDatePhoneAvailable(response.data.data);
        console.log("API response:", response);
      } catch (err) {
        console.error("user detail api error:", err);
      }
    };

    if (userMobile) {
      fetchUserDetail();
    }
  }, [userMobile]);

  // Watch for userMobile updates
  useEffect(() => {
    const storedMobile = Cookies.get("userMobile");
    if (storedMobile) {
      setUserMobile(Math.round(storedMobile));
    }

    const handleStorageChange = () => {
      const updatedMobile = Cookies.get("userMobile");
      if (updatedMobile) {
        setUserMobile(updatedMobile);
        // fetchUserDetail();
      }
    };

    window.addEventListener("userMobileUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("userMobileUpdated", handleStorageChange);
    };
  }, []);

  const handleUserSignUpData = async () => {
    let validationErrors;
    if (!userMobile) {
      validationErrors = validateAstrologerForm("user");
    }
    console.log(validationErrors);

    setErrors(validationErrors);
    if (!userMobile) {
      if (Object.keys(validationErrors).length > 0) {
        return;
      }
    }

    const formData = {
      first_name: document.getElementById("fname").value.trim(),
      gender: document.querySelector('input[name="gender"]:checked')?.value,
      date_of_birth: document.getElementById("birthdayany").value.trim(),
      re_use_date_of_birth:
        document.getElementById("birthdayReUse")?.value.trim() || "",
      placeOfBorn: document.getElementById("searchAddress").value.trim(),
      languages: document.getElementById("language").value.trim(),
    };
    console.log(formData);

    if (!formData) return;

    const phone = userMobile ? userMobile : datePhoneAvailable?.phone;

    if (phone) {
      try {
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/update-user/${phone}`,
          {
            name: formData.first_name,
            gender: formData.gender,
            dateOfBirth: formData.date_of_birth,
            reUseDateOfBirth: formData.re_use_date_of_birth || "",
            placeOfBorn: formData.placeOfBorn,
            language: formData.languages,
            // totalAmount: 0, // if needed
          }
        );

        console.log("response", response.data);

        if (response.data.message === "success") {
          Cookies.set("userIds", response.data.user._id , {
             expires: 3650,
              secure: true,
              sameSite: "Strict",
          });
          window.dispatchEvent(new Event("userMobileUpdated"));
          router.push("/chat-with-astrologer");
        }

        console.log("User Updated:", response.data);
      } catch (err) {
        console.error("Error updating user:", err);
      }
    } else {
      setOtpPopUpDisplays(true);
    }
  };

  useEffect(() => {
    setEditName(datePhoneAvailable?.name || "");
    setEditGender(datePhoneAvailable?.gender || "");
    setEditDateOfBirth(datePhoneAvailable?.dateOfBirth || "");
    setEditLanguage(datePhoneAvailable?.language || "");
    setEditPob(datePhoneAvailable?.placeOfBorn || "");
  }, [datePhoneAvailable]);
  return (
    <main className="main-content">
      <section className="astrologer-registration-bg user-registration-bg">
        <div className="container">
          <div className={otpPopUpDisplays == true && `outer-send-otp-main`}>
            {otpPopUpDisplays && (
              <UserOtpLoginData setOtpPopUpDisplay={setOtpPopUpDisplays} />
            )}
          </div>
          <div className="user-login-and-uder-reg-bg">
            <div className="user-reg-ctm">
              <div className="inner-astrologer-registration">
                <div className="registration-heading">
                  <h1 className="common-h1-heading">User Registration</h1>
                </div>
              </div>
              <div className="user-registration-form">
                <form action="">
                  <div className="form-filed-section-bg">
                    <div className="inner-form-filed-sec">
                      <div className="label-content">
                        <label for="Name">
                          Name <span>(नाम)</span>
                        </label>
                      </div>
                      <input
                        type="text"
                        id="fname"
                        name="fname"
                        className="common-input-filed"
                        placeholder="What is your name?"
                        required
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                      {errors?.firstName && (
                        <p className="error">{errors?.firstName}</p>
                      )}
                    </div>
                    <div className="inner-form-filed-sec">
                      <div className="label-content">
                        <label for="Gender">
                          Gender <span>(लिंग)</span>
                        </label>
                      </div>
                      <div className="man-input-filed-sec input-gender-sec">
                        <div className="inner-radio">
                          <input
                            type="radio"
                            id="Male"
                            name="gender"
                            value="Male"
                            checked={editGender == "Male"}                            
                        onChange={(e) => setEditGender(e.target.value)}
                          />
                          <label for="html">Male</label>
                        </div>

                        <div className="inner-radio">
                          <input
                            type="radio"
                            id="Female"
                            name="gender"
                            value="Female"
                            checked={editGender == "Female"}
                        onChange={(e) => setEditGender(e.target.value)}

                          />
                          <label for="css">Female</label>
                        </div>

                        <div className="inner-radio">
                          <input
                            type="radio"
                            id="Other"
                            name="gender"
                            value="Other"
                            checked={editGender == "Other"}
                        onChange={(e) => setEditGender(e.target.value)}

                          />
                          <label for="css">Other</label>
                        </div>
                        {errors?.gender && (
                          <p className="error">{errors?.gender}</p>
                        )}
                      </div>
                    </div>

                    <div className="inner-form-filed-sec">
                      <div className="label-content">
                        <label for="birthdayany">
                          Date of Birth <span>(जन्मतिथि)</span>
                        </label>
                      </div>

                      <input
                        type="date"
                        id="birthdayany"
                        name="birthdayany"
                        className="common-input-filed"
                        placeholder="Select your birth date"
                        required
                        value={editDateOfBirth}
                        onChange={(e) => setEditDateOfBirth(e.target.value)}                        
                         max={todayDate} 
                      />
                      {errors?.dateOfBirthAnys && (
                        <p className="error">{errors?.dateOfBirthAnys}</p>
                      )}
                    </div>
                    <div className="inner-form-filed-sec">
                      <div className="label-content remove-astrict">
                        <label for="Gender">
                          Do you know your time of birth?
                          <span>(क्या आप अपना जन्म समय जानते हैं?)</span>
                        </label>
                      </div>
                      <div className="man-input-filed-sec input-gender-sec">
                        <div className="inner-radio">
                          <input
                            type="radio"
                            id="yes"
                            name="YesNO"
                            value="yes"
                            required
                            onChange={() => setDateOfBirthAvailable("yes")}
                          />
                          <label for="html">Yes</label>
                        </div>

                        <div className="inner-radio">
                          <input
                            type="radio"
                            id="no"
                            name="YesNO"
                            value="no"
                            required
                            onChange={() => setDateOfBirthAvailable("no")}
                          />
                          <label for="css">No</label>
                        </div>
                      </div>
                      {dateOfBirthAvailable == "yes" && (
                        <div className="man-input-filed-sec know-your-time">
                          <input
                            type="time"
                            id="birthdayReUse"
                            name="birthdaytime"
                            className="common-input-filed"
                            placeholder="Select your birth time"
                          />
                        </div>
                      )}
                    </div>

                    <div className="inner-form-filed-sec you-born-ctm-filed erch-input-filed">
                      <div className="label-content remove-astrict">
                        <label for="Languages ">
                          Where were you born?
                          <span>(आपका जन्म कहां हुआ था?)</span>
                        </label>
                      </div>

                      <input
                        type="search"
                        id="searchAddress"
                        name="gsearch"
                        placeholder="Where were you born"
                        className="common-input-filed"
                       value={editPob}
                        onChange={(e) => setEditPob(e.target.value)}
                      />
                      {/* <button type="submit" className="ctm-white-color">
                        <i className="fa-solid fa-magnifying-glass"></i>
                      </button> */}
                    </div>

                    <div className="inner-form-filed-sec">
                      <div className="label-content">
                        <label for="Languages">
                          Languages <span>(भाषाएँ)</span>
                        </label>
                      </div>

                      <select
                        name="language"
                        id="language"
                        className="common-input-filed"
                        required
                        value={editLanguage}
                        onChange={(e) => setEditLanguage(e.target.value)}
                      >
                        <option value="select language">
                          Select all your languages?
                        </option>
                        <option value="English">English</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Bengali">Bengali</option>
                        <option value="Assamese">Assamese</option>
                        <option value="Punjabi">Punjabi</option>
                      </select>
                      {errors?.languages && (
                        <p className="error">{errors?.languages}</p>
                      )}
                    </div>
                  </div>
                  <div className="reg-sumbit-button">
                    <button type="button" onClick={handleUserSignUpData}>
                      {userMobile
                        ? "Update User Detail"
                        : "Start Chat With Astrologer"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default StartUserName;
