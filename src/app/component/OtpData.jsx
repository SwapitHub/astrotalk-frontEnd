"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";

const OtpData = ({ setOtpPopUpDisplayAstro, otpPopUpDisplayAstro }) => {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const [timeOtpMessage, setTimeOtpMessage] = useState("");
  const localAstroMobile = secureLocalStorage.getItem("astrologer-phone");
  const [pendingData, setPendingData] = useState([]);

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/astrologer-list?astroStatus=true`
      )
      .then((response) => {
        setPendingData(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const sendOtp = async () => {
    try {
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
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/verify-otp`,
        {
          phone: phone,
          otp: otp,
        }
      );
      setMessage(response.data.message);

      const matchMobileAstro = pendingData.find(
        (item) => item.mobileNumber === phone
      );

      console.log(pendingData);

      if (matchMobileAstro !== undefined) {
        router.push("/astrologer-dashboard");
        setOtpPopUpDisplayAstro(false);
        setOtpSent(false);
        secureLocalStorage.setItem("astrologer-phone", phone);
        try {
          const response = await axios.put(
            `${process.env.NEXT_PUBLIC_WEBSITE_URL}/update-astro-status-by-mobile/${phone}`,
            {
              profileStatus: true,
              chatStatus: false,
            }
          );
          if (response.data.message == "Success") {
            setTimeout(() => {
              window.location.reload();
            }, 2000);
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
        <div className="man-input-filed-sec send-otp">
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
              close
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
              close
            </span>
          )}

          <h1>{otpSent == false ? `Continue with Phone` : `Verify Phone`}</h1>
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

          <p>{message}</p>
        </div>
      )}
    </div>
  );
};

export default OtpData;
