"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function UserOtpLoginData({ setOtpPopUpDisplay }) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const [timeOtpMessage, setTimeOtpMessage] = useState("");
  const [userLoginData, setUserLoginData] = useState();
  const router = useRouter();

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/user-login`)
      .then((response) => {
        setUserLoginData(response.data);
      })
      .catch((error) => {
        console.error(error);
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
    const formData = {
      first_name: document.getElementById("fname")?.value.trim(),
      gender:
        document.querySelector('input[name="gender"]:checked')?.value,
      date_of_birth: document.getElementById("birthday")?.value.trim() || "",
      re_use_date_of_birth:
        document.getElementById("birthdayReUse")?.value.trim() ,
      placeOfBorn: document.getElementById("searchAddress")?.value.trim(),
      languages: document.getElementById("language")?.value.trim(),
      // mobileNumber: document.getElementById("mobileNumber")?.value.trim() || "",
    };
console.log(formData);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/verify-otp`,
        {
          phone: phone,
          otp: otp,
        }
      );
      setMessage(response.data.message);

      let userMatch = userLoginData.find((item) => {
        return item.phone == phone;
      });

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
            }
          );

          if (userLoginRes.status === 200 || userLoginRes.status === 201) {
            setOtpPopUpDisplay(false);
            localStorage.setItem("userIds", userLoginRes.data.user._id);
            localStorage.setItem("userMobile", phone);
            console.log("User login successful, User ID:", phone);
            window.dispatchEvent(new Event("storageUserMobile"));
            router.push("/chat-with-astrologer");
          }
        }
      } else {
        try {
          const response = await axios.put(
            `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/update-user/${phone}`,
            {
              name: formData.first_name,
              gender: formData.gender,
              dateOfBirth: formData.date_of_birth,
              reUseDateOfBirth: formData.re_use_date_of_birth,
              placeOfBorn: formData.placeOfBorn,
              language: formData.languages,
              // totalAmount: 0,
            }
          );
          if (response.data.message == "success") {
            setOtpPopUpDisplay(false);
            localStorage.setItem("userIds", response.data.user._id);
            localStorage.setItem("userMobile", phone);
            window.dispatchEvent(new Event("storageUserMobile"));
            router.push("/chat-with-astrologer");
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
    }
  };

  return (
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
            setOtpPopUpDisplay(false);
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
            setOtpPopUpDisplay(false);
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
              e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
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

      <p>{message}</p>
    </div>
  );
}

export default UserOtpLoginData;
