"use client";
import axios from "axios";
import Cookies from "js-cookie";
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


const sendOtp = async () => {
  try {
    let astroData = null;

    // Step 1: Try to get astrologer details
    try {
      const responseMatch = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/astrologer-detail/${phone}`
      );
      astroData = responseMatch?.data?.data;

      console.log(astroData, "Astrologer data");

      // Step 2: Check block status
      if (astroData?.blockUnblockAstro === true || astroData?.deleteAstroLoger==true) {
        setMessage("Your account has been blocked. Please contact support.");
        return;
      }
    } catch (err) {
      console.log("Astrologer not found or error:", err);
    }

    // Step 3: Send OTP regardless of previous account status (new or unblocked user)
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_WEBSITE_URL}/send-otp`,
      {
        phone: phone,
      }
    );

    setOtpSent(true);
    let countdown = 60;
    setTimeOtpMessage(countdown); // Initialize countdown

    const timer = setInterval(() => {
      countdown -= 1;
      setTimeOtpMessage(countdown);

      if (countdown <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    setMessage(response.data.message);
  } catch (error) {
    if (error.response?.status === 404) {
      setMessage("Mobile number not registered");
    } else {
      setMessage("Error sending OTP");
    }
    console.log(error);
  }
};


  const verifyOtp = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/verify-otp`,
        {
          phone: phone,
          otp: otp,
        }
      );
      setMessage(response.data.message);

      if (response.data.success == true) {
        router.push("/astrologer");
        setOtpPopUpDisplayAstro(false);
        setOtpSent(false);
        Cookies.set("astrologer-phone", phone, {
          expires: 3650,
          secure: true,
          sameSite: "Strict",
        });
        sessionStorage.setItem("session-astrologer-phone", phone);
        try {
          const response = await axios.put(
            `${process.env.NEXT_PUBLIC_WEBSITE_URL}/update-business-profile/${phone}`,
            {
              profileStatus: true,
              chatStatus: false,
            }
          );
          // update order history
          const updateList = await axios.put(
            `${process.env.NEXT_PUBLIC_WEBSITE_URL}/userId-to-astrologer-astro-list-update`,
            {
              mobileNumber: phone,
              profileStatus: true,
            }
          );
          console.log("update order history", response);

          if (response.data.message == "Success") {
            // setTimeout(() => {
            //   window.location.reload();
            // }, 2000);
          }
          console.log("Astrologer status updated:", response.data);
        } catch (error) {
          console.error(
            "Failed to update astrologer status:",
            error.response?.data?.error || error.message
          );
        }
      } else {
        alert("mobile number not match or please registration");
      }
    } catch (error) {
      setMessage("Invalid OTP or login formData");
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

            <h1>{otpSent == false ? `Continue with Phone` : `Verify Phone`}</h1>
          </div>
          {otpSent == false ? (
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
            </div>
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

          <div
            className={`popup-btm-content ${
              message == "OTP sent successfully" ? "green" : "red"
            }`}
          >
            <p>{message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OtpData;
