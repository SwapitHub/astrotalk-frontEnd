"use client";
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import { toast } from "react-toastify";

const OtpData = ({ setOtpPopUpDisplayAstro, otpPopUpDisplayAstro }) => {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const [timeOtpMessage, setTimeOtpMessage] = useState("");
  const [loginEmail, setLoginEmail] = useState(false);
  const [forgetPswShow, setForgetPswShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");

  // -------------------- SEND OTP --------------------
  const sendOtp = async () => {
    try {
      let astroData = null;

      // Check astrologer details
      try {
        const responseMatch = await axios.get(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/astrologer-detail/${phone}`
        );
        astroData = responseMatch?.data?.data;
      } catch (err) {
        setMessage("Your mobile number is not registered.");
        return; // Stop — don't send OTP
      }

      if (!astroData) {
        setMessage("Your mobile number is not registered.");
        return;
      }

      if (astroData?.deleteAstroLoger === true) {
        setMessage("Your account has been deleted. Please contact support.");
        return;
      }

      if (astroData?.blockUnblockAstro === true) {
        setMessage("Your account has been blocked. Please contact support.");
        return;
      }

      if (astroData?.astroStatus === false) {
        setMessage(
          "You can log in after your registration is approved by the admin."
        );
        return;
      }

      // ✅ Send OTP only for valid and approved astrologers
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/send-otp`,
        { phone }
      );

      setOtpSent(true);
      let countdown = 60;
      setTimeOtpMessage(countdown);

      const timer = setInterval(() => {
        countdown -= 1;
        setTimeOtpMessage(countdown);
        if (countdown <= 0) clearInterval(timer);
      }, 1000);

      setMessage(response.data.message || "OTP sent successfully.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Error sending OTP.");
    }
  };

  // -------------------- VERIFY OTP --------------------
  const verifyOtp = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/verify-otp`,
        { phone, otp }
      );

      if (response.data.success) {
        Cookies.set("astrologer-phone", phone, {
          expires: 3650,
          secure: true,
          sameSite: "Strict",
        });

        // Redirect astrologer dashboard
        router.push("/astrologer");
        setOtpPopUpDisplayAstro(false);
        setOtpSent(false);
        setMessage("Login successful!");
      } else {
        setMessage("Invalid OTP or not registered.");
      }
    } catch (error) {
      setMessage("Invalid OTP or server error.");
    }
  };

  // -------------------- EMAIL LOGIN --------------------
  const handleLogin = async () => {
    if (!email || !password) {
      setMessage("Email and password are required.");
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/astrologer-email-login`,
        { email, Password: password }
      );

      const { token, astrologer } = response.data;

      // Save JWT
      Cookies.set("astroToken", token, {
        expires: 1,
        secure: true,
        sameSite: "Strict",
      });
      Cookies.set("astroEmail", astrologer.email, {
        expires: 3650,
        secure: true,
      });
      if (response.data.success) {
        Cookies.set("astrologer-phone", astrologer.mobileNumber, {
          expires: 3650,
          secure: true,
          sameSite: "Strict",
        });

        // Redirect astrologer dashboard
        setOtpPopUpDisplayAstro(false);
        setOtpSent(false);
        router.push("/astrologer");
        setMessage("Login successful!");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed.");
    }
  };

  // -------------------- RESET PASSWORD --------------------
  const handleResetPassword = async () => {
    if (!resetEmail) {
      setMessage("Please enter your registered email.");
      return;
    }
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/astrologer-request-Password-Reset`,
        { email: resetEmail }
      );
      setMessage(res.data.message || "Password reset link sent to your email.");
      setResetEmail("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error sending reset email.");
    }
  };
  return (
    <div className={otpPopUpDisplayAstro == true && `outer-send-otp-main`}>
      {otpPopUpDisplayAstro && (
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
                  setOtpPopUpDisplayAstro(false);
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
                  setOtpPopUpDisplayAstro(false);
                  setOtpSent(true);
                }}
              >
                <span></span>
                <span></span>
              </span>
            )}

            <h1>
              {forgetPswShow
                ? "Astrologer Reset Password"
                : loginEmail
                ? "Astrologer Login with Email"
                : otpSent == false
                ? `Astrologer Login with Phone`
                : `Verify Phone`}
            </h1>
          </div>
          {/* ------------------- PHONE LOGIN ------------------- */}
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
                  <button
                    className="text-btn"
                    onClick={() => setLoginEmail(true)}
                  >
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
                  e.target.value = e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 6);
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
      )}
    </div>
  );
};

export default OtpData;
