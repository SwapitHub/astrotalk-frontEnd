"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import UserOtpLoginData from "@/app/component/UserOtpLoginData";
import useDebounce from "@/app/hook/useDebounce";

const StartUserName = () => {
  const router = useRouter();

  // 🔹 State management
  const [otpPopUpDisplays, setOtpPopUpDisplays] = useState(false);
  const [dateOfBirthAvailable, setDateOfBirthAvailable] = useState("no");
  const [datePhoneAvailable, setDatePhoneAvailable] = useState(null);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  // 🔹 Controlled form fields
  const [userMobile, setUserMobile] = useState("");
  const debouncedSearch = useDebounce(userMobile, 1000);
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [editName, setEditName] = useState("");
  const [editGender, setEditGender] = useState("");
  const [editDateOfBirth, setEditDateOfBirth] = useState("");
  const [editLanguage, setEditLanguage] = useState("");
  const [editPob, setEditPob] = useState("");

  const todayDate = new Date().toISOString().split("T")[0];

  // 🔹 Fetch user details if phone exists
  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/user-login-detail/${debouncedSearch}`
        );
        setDatePhoneAvailable(response.data.data);
      } catch (err) {
        console.error("User detail API error:", err);
      }
    };
    if (debouncedSearch) fetchUserDetail();
  }, [debouncedSearch]);

  // 🔹 Watch for userMobile updates in cookies
  useEffect(() => {
    const storedMobile = Cookies.get("userMobile");
    if (storedMobile) setUserMobile(storedMobile);

    const handleStorageChange = () => {
      const updatedMobile = Cookies.get("userMobile");
      if (updatedMobile) setUserMobile(updatedMobile);
    };

    window.addEventListener("userMobileUpdated", handleStorageChange);
    return () =>
      window.removeEventListener("userMobileUpdated", handleStorageChange);
  }, []);

  // 🔹 Pre-fill when data available
  useEffect(() => {
    if (datePhoneAvailable) {
      setEditName(datePhoneAvailable.name || "");
      setEditGender(datePhoneAvailable.gender || "");
      setEditDateOfBirth(datePhoneAvailable.dateOfBirth || "");
      setEditLanguage(datePhoneAvailable.language || "");
      setEditPob(datePhoneAvailable.placeOfBorn || "");
      setUserEmail(datePhoneAvailable.userEmail || "");
      setUserPassword(datePhoneAvailable.userPassword || "");
      setUserMobile(datePhoneAvailable.phone || "");
    }
  }, [datePhoneAvailable]);

  // ✅ Form validation
  const validateForm = () => {
    const newErrors = {};

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userEmail) newErrors.email = "Email is required.";
    else if (!emailRegex.test(userEmail))
      newErrors.email = "Please enter a valid email address.";

    // Password
    const passwordRegex = /^(?=.*[0-9]).{6,}$/;
    if (!userPassword) newErrors.password = "Password is required.";
    else if (!passwordRegex.test(userPassword))
      newErrors.password =
        "Password must be at least 6 characters and include a number.";

    // Mobile
    const mobileRegex = /^[0-9]{10}$/;
    if (!userMobile) newErrors.mobile = "Mobile number is required.";
    else if (!mobileRegex.test(userMobile))
      newErrors.mobile = "Please enter a valid 10-digit mobile number.";

    // Name
    if (!editName.trim()) newErrors.firstName = "Name is required.";

    // Gender
    if (!editGender) newErrors.gender = "Please select a gender.";

    // Language
    if (!editLanguage || editLanguage === "select language")
      newErrors.language = "Please select a language.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Handle register or update
  const handleUserSignUpData = async () => {
    if (!validateForm()) return;

    const formData = {
      name: editName.trim(),
      gender: editGender,
      dateOfBirth: editDateOfBirth.trim(),
      reUseDateOfBirth:
        document.getElementById("birthdayReUse")?.value.trim() || "",
      placeOfBorn: editPob.trim(),
      language: editLanguage.trim(),
      userEmail: userEmail.trim(),
      userPassword: userPassword.trim(),
      phone: userMobile?.trim(),
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/user-login`,
        formData
      );

      if (
        response.data.message === "success" ||
        response.data.message === "User registered successfully"
      ) {
        // Cookies.set("userIds", response.data.user._id, {
        //   expires: 3650,
        //   secure: true,
        //   sameSite: "Strict",
        // });
        // Cookies.set("userMobile", formData.phone, { expires: 3650 });

        // window.dispatchEvent(new Event("userMobileUpdated"));
        router.push("/chat-with-astrologer");
      }
    } catch (err) {
      console.error("Error during user registration/update:", err);
      setMessage(err?.response?.data?.error);
    }
  };

  return (
    <main className="main-content">
      <section className="astrologer-registration-bg user-registration-bg">
        <div className="container">
          {otpPopUpDisplays && (
            <div className="outer-send-otp-main">
              <UserOtpLoginData setOtpPopUpDisplay={setOtpPopUpDisplays} />
            </div>
          )}

          <div className="user-login-and-uder-reg-bg">
            <div className="user-reg-ctm">
              <div className="registration-heading">
                <h1 className="common-h1-heading">User Registration</h1>
              </div>

              <div className="user-registration-form">
                <form>
                  <div className="form-filed-section-bg">
                    {/* Name */}
                    <div className="inner-form-filed-sec">
                      <label>
                        Name <span>(नाम)</span>
                      </label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="common-input-filed"
                        placeholder="Enter your name"
                      />
                      {errors.firstName && (
                        <p className="error">{errors.firstName}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="inner-form-filed-sec">
                      <label>
                        Email <span>(ईमेल)</span>
                      </label>
                      <input
                        type="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        className="common-input-filed"
                        placeholder="Enter your email"
                      />
                      {errors.email && <p className="error">{errors.email}</p>}
                    </div>

                    {/* Password */}
                    <div className="inner-form-filed-sec">
                      <label>
                        Password <span>(पासवर्ड)</span>
                      </label>
                      <input
                        type="password"
                        value={userPassword}
                        onChange={(e) => setUserPassword(e.target.value)}
                        className="common-input-filed"
                        placeholder="Enter password"
                      />
                      {errors.password && (
                        <p className="error">{errors.password}</p>
                      )}
                    </div>

                    {/* Mobile */}
                    <div className="inner-form-filed-sec">
                      <label>
                        Mobile Number <span>(मोबाइल नंबर)</span>
                      </label>
                      <input
                        type="text"
                        value={userMobile}
                        onChange={(e) => setUserMobile(e.target.value)}
                        className="common-input-filed"
                        placeholder="Enter your 10-digit mobile number"
                        onInput={(e) => {
                          e.target.value = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 10);
                        }}
                      />
                      {errors.mobile && (
                        <p className="error">{errors.mobile}</p>
                      )}
                    </div>

                    {/* Gender */}
                    <div className="inner-form-filed-sec">
                      <div className="label-content">
                        <label>
                          Gender <span>(लिंग)</span>
                        </label>
                      </div>

                      <div className="man-input-filed-sec input-gender-sec">
                        {["Male", "Female", "Other"].map((g) => (
                          <div className="inner-radio">
                            <input
                              type="radio"
                              name="gender"
                              value={g}
                              checked={editGender === g}
                              onChange={(e) => setEditGender(e.target.value)}
                            />
                            <label key={g}>{g}</label>
                          </div>
                        ))}
                      </div>
                      {errors.gender && (
                        <p className="error">{errors.gender}</p>
                      )}
                    </div>

                    {/* DOB */}
                    <div className="inner-form-filed-sec">
                      <label>
                        Date of Birth <span>(जन्मतिथि)</span>
                      </label>
                      <input
                        type="date"
                        id="birthdayany"
                        value={editDateOfBirth}
                        onChange={(e) => setEditDateOfBirth(e.target.value)}
                        className="common-input-filed"
                        max={todayDate}
                        required
                      />
                    </div>

                    {/* Birth Place */}
                    <div className="inner-form-filed-sec">
                      <label>
                        Place of Birth <span>(जन्म स्थान)</span>
                      </label>
                      <input
                        type="text"
                        id="searchAddress"
                        value={editPob}
                        onChange={(e) => setEditPob(e.target.value)}
                        className="common-input-filed"
                        placeholder="Where were you born?"
                      />
                    </div>

                    {/* Language */}
                    <div className="inner-form-filed-sec">
                      <label>
                        Languages <span>(भाषाएँ)</span>
                      </label>
                      <select
                        id="language"
                        value={editLanguage}
                        onChange={(e) => setEditLanguage(e.target.value)}
                        className="common-input-filed"
                        required
                      >
                        <option value="">Select your language</option>
                        <option value="English">English</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Bengali">Bengali</option>
                        <option value="Assamese">Assamese</option>
                        <option value="Punjabi">Punjabi</option>
                      </select>
                      {errors.language && (
                        <p className="error">{errors.language}</p>
                      )}
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="reg-sumbit-button">
                    <button type="button" onClick={handleUserSignUpData}>
                      Register & Start Chat
                    </button>
                  </div>
                  <span>{message}</span>
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
