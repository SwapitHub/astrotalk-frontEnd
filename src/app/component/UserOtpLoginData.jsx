"use client";
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function UserOtpLoginData({ setOtpPopUpDisplay, editDetailOrder }) {
  const router = useRouter();
  const [phone, setPhone] = useState(
    editDetailOrder ? editDetailOrder?.userMobile : ""
  );
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const [timeOtpMessage, setTimeOtpMessage] = useState("");
  const [userLoginData, setUserLoginData] = useState();
  const [loginEmail, setLoginEmail] = useState(false);
  const [forgetPswShow, setForgetPswShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");

  // useEffect(() => {
  //   axios
  //     .get(
  //       `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/user-login-detail/${phone}`
  //     )
  //     .then((response) => {
  //       setUserLoginData(response.data);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }, []);

  const sendOtp = async () => {
    try {
      let userData = null;

      // Step 1: Try to get user details
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/user-login-detail/${phone}`
        );
        userData = res?.data?.data;

        // Step 2: Block/Delete check
        if (userData?.blockUser === true) {
          setMessage("Your account has been blocked. Please contact support.");
          return;
        }

        if (userData?.deleteUser === true) {
          setMessage("Your account has been deleted. Please contact support.");
          return;
        }
      } catch (err) {
        // If API fails (user not found / error), treat as new phone
        console.log("User not found or error:", err);
      }
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/send-otp`,
        {
          phone: phone,
        }
      );

      setOtpSent(true);
      let countdown = 60;
      setTimeOtpMessage(countdown); // Initialize countdown value

      const timer = setInterval(() => {
        countdown -= 1;
        setTimeOtpMessage(countdown);

        if (countdown <= 0) {
          clearInterval(timer);
        }
      }, 1000);
      setMessage(response.data.message);
    } catch (error) {
      setMessage("Error sending OTP");
      console.log(error);
    }
  };

  const verifyOtp = async () => {
    const formData = {
      first_name: document.getElementById("fname")?.value?.trim(),
      gender: document.querySelector('input[name="gender"]:checked')?.value,
      date_of_birth: document.getElementById("birthdayany")?.value?.trim(),
      re_use_date_of_birth: document
        .getElementById("birthdayReUse")
        ?.value?.trim(),
      placeOfBorn: document.getElementById("searchAddress")?.value?.trim(),
      languages: document.getElementById("language")?.value?.trim(),
      // mobileNumber: document.getElementById("mobileNumber")?.value.trim() || "",
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/verify-otp`,
        {
          phone: phone,
          otp: otp,
        }
      );
      setMessage(response.data.message);

      // let userMatch = userLoginData.find((item) => {
      //   return item.phone == phone;
      // });
      let userMatch = null;
      try {
        const userMatchRes = await axios.get(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/user-login-detail/${phone}`
        );
        if (userMatchRes.data.message === "success") {
          userMatch = userMatchRes.data;
        }
      } catch (error) {
        console.warn("User not found, proceeding to create new user.");
      }

      if (!userMatch) {
        if (response.status == 200) {
          const userLoginRes = await axios.post(
            `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/user-login`,
            {
              name: formData.first_name,
              gender: formData.gender,
              dateOfBirth: formData.date_of_birth,
              reUseDateOfBirth: formData.re_use_date_of_birth,
              placeOfBorn: formData.placeOfBorn,
              language: formData.languages,
              phone: phone,
              totalAmount: 0,
              freeChatStatus: true,
            }
          );
          // userLoginRes.data.user.freeChatStatus==true ? `/chat-with-astrologer/user/${userLoginRes.data.user._id}`:
          if (userLoginRes.status === 200 || userLoginRes.status === 201) {
            setOtpPopUpDisplay(false);
            Cookies.set("userIds", userLoginRes.data.user._id, {
              expires: 3650,
              secure: true,
              sameSite: "Strict",
            });
            Cookies.set("userMobile", phone, {
              expires: 3650,
              secure: true,
              sameSite: "Strict",
            });
            console.log("User login successful, User ID:", phone);
            window.dispatchEvent(new Event("userMobileUpdated"));
            router.push(
              formData.first_name ? "/chat-with-astrologer" : "/free-chat/start"
            );
            console.log(formData);
          }
        }
      } else {
        try {
          const response = await axios.put(
            `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/update-user/${phone}`,
            {
              name: userMatch.name,
              gender: userMatch.gender,
              dateOfBirth: userMatch.dateOfBirth,
              reUseDateOfBirth: userMatch.re_use_date_of_birth
                ? userMatch.re_use_date_of_birth
                : "",
              placeOfBorn: userMatch.placeOfBorn,
              language: userMatch.language,
              // totalAmount: 0,
            }
          );
          console.log("response", response.data);

          if (response.data.message == "success") {
            setOtpPopUpDisplay(false);
            Cookies.set("userIds", response.data.user._id, {
              expires: 3650,
              secure: true,
              sameSite: "Strict",
            });
            Cookies.set("userMobile", phone, {
              expires: 3650,
              secure: true,
              sameSite: "Strict",
            });
            window.dispatchEvent(new Event("userMobileUpdated"));
            // router.push("/chat-with-astrologer");
          }
          console.log("User Updated:", response.data);
        } catch (error) {
          console.error(
            "Error updating user:",
            error.response?.data || error.message
          );
        }
      }
    } catch (error) {
      setMessage("Invalid OTP or login formData");
      console.log("Invalid OTP or login formData");
    }
  };

  // ------------------ EMAIL LOGIN SECTION ------------------
  const handleLogin = async () => {
    if (!email || !password) {
      setMessage("Email and Password are required.");
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/user-email-login`,
        { userEmail: email, userPassword: password }
      );

      const { token, user } = response.data;

      // Store JWT token securely in cookies
      Cookies.set("userToken", token, {
        expires: 1, // 1 day
        secure: true,
        sameSite: "Strict",
      });
      setOtpPopUpDisplay(false);
      Cookies.set("userIds", response.data.user.id, {
        expires: 3650,
        secure: true,
        sameSite: "Strict",
      });
      Cookies.set("userMobile", response.data.user.userMobile, {
        expires: 3650,
        secure: true,
        sameSite: "Strict",
      });

      setMessage("Login successful!");
      setOtpPopUpDisplay(false);
      window.dispatchEvent(new Event("userMobileUpdated"));
      router.push("/chat-with-astrologer");
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Login failed.");
    }
  };

  const handleResetPassword = async () => {
    if (!resetEmail) {
      setMessage("Please enter your registered email.");
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/user-request-Password-Reset`,
        { userEmail: resetEmail }
      );

      if (res.status === 200) {
        setMessage("Password reset link sent to your email.");
        setResetEmail(" ");
      } else {
        setMessage(res.data.message || "Error sending email.");
      }
    } catch (err) {
      console.error("Reset email error:", err);
      setMessage(err.response?.data?.message || "Server error.");
    }
  };

  return (
    <div className="send-otp">
      <div className="popup-header">
        {otpSent == true && (
          <span
            className="close-icon back"
            onClick={(e) => {
              e.preventDefault();

              setOtpSent(false);
            }}
          >
            back
          </span>
        )}
        {otpSent == false ? (
          <span
            className="close-icon"
            onClick={(e) => {
              e.preventDefault();
              setOtpPopUpDisplay(false);
              setOtpSent(false);
            }}
          >
            <span></span>
            <span></span>
          </span>
        ) : (
          <span
            className="close-icon"
            onClick={(e) => {
              e.preventDefault();
              setOtpPopUpDisplay(false);
              setOtpSent(true);
            }}
          >
            <span></span>
            <span></span>
          </span>
        )}

        <h1>
          {forgetPswShow
            ? "User Reset Password"
            : loginEmail
            ? "User Login with Email"
            : otpSent == false
            ? `User Login with Phone`
            : `Verify Phone`}
        </h1>
      </div>

      {otpSent == false ? (
        <>
          {loginEmail ? (
            <>
              {forgetPswShow ? (
                <div className="number--continious-popup login-email-main">
                  <div className="user-login-email">
                    <span>
                      Enter your Registred Email to reset your password.
                    </span>
                    <Link
                      onClick={() => setOtpPopUpDisplay(false)}
                      href="/free-chat/start"
                    >
                      Join now
                    </Link>
                  </div>

                  <div className="form-field">
                    <input
                      type="email"
                      placeholder="Email ID"
                      className="common-input-filed"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                    />
                  </div>

                  <button onClick={handleResetPassword}>Submit</button>

                  <div className="forget-and-login-with-mobile-btns">
                    <button
                      className="text-btn"
                      onClick={() => {
                        setForgetPswShow(false);
                        setLoginEmail(false);
                      }}
                    >
                      Login With Mobile
                    </button>
                    <button
                      className="text-btn"
                      onClick={() => {
                        setLoginEmail(true);
                        setForgetPswShow(false);
                      }}
                    >
                      Login With Email
                    </button>
                  </div>
                </div>
              ) : (
                <div className="number--continious-popup login-email-main">
                  <div className="user-login-email">
                    <span>Not A User Yet?</span>
                    <Link
                      onClick={() => setOtpPopUpDisplay(false)}
                      href="/free-chat/start"
                    >
                      Join now
                    </Link>
                  </div>

                  <div className="form-field">
                    <input
                      type="email"
                      placeholder="Email ID"
                      className="common-input-filed"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="form-field">
                    <input
                      type="password"
                      placeholder="Password"
                      className="common-input-filed login-user-email"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <button onClick={handleLogin}>Login</button>

                  <div className="forget-and-login-with-mobile-btns">
                    <button
                      className="text-btn"
                      onClick={() => setForgetPswShow(true)}
                    >
                      Forget Password
                    </button>
                    <button
                      className="text-btn"
                      onClick={() => setLoginEmail(false)}
                    >
                      Login With Mobile
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="number--continious-popup">
              <p>You will receive a 6 digit code for verification</p>
              <input
                type="text"
                placeholder="Enter phone number"
                // id="mobileNumber"
                name="quantity"
                onInput={(e) => {
                  e.target.value = e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 10);
                }}
                className="common-input-filed"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <button onClick={sendOtp}>Send OTP</button>
              <button className="text-btn" onClick={() => setLoginEmail(true)}>
                Login With Email
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="enter-otp">
          <h2>OTP sent to +91- {phone}</h2>
          <input
            type="text"
            placeholder="Enter OTP"
            className="common-input-filed"
            onInput={(e) => {
              e.target.value = e.target.value.replace(/\D/g, "").slice(0, 6);
            }}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verifyOtp}>Verify OTP</button>

          <div className="resend-both-col">
            <div className="left-col-resend">
              <p>
                Resend OTP available{" "}
                {timeOtpMessage > 0 && <span>{timeOtpMessage}s</span>}
              </p>
            </div>
            {timeOtpMessage == 0 && (
              <div className="left-col-resend">
                <p>
                  <button onClick={sendOtp}>Resend OTP</button>
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {message && (
        <div
          className={`popup-btm-content ${
            message == "OTP sent successfully" ? "green" : "red"
          }`}
        >
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}

export default UserOtpLoginData;
