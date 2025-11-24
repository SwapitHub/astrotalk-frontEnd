"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  // ✅ Get reset token from URL
  const token = searchParams.get("token");

  const handleResetSubmit = async () => {
    if (!newPassword || !confirmPassword) {
      setMessage("⚠️ Please fill in both fields.");
      return;
    }

    if (newPassword.length < 6) {
      setMessage("⚠️ Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("⚠️ Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/astrologer-reset-password`,
        { token, newPassword }
      );

      if (res.status === 200) {
        setMessage("✅ Password updated successfully!");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          router.push("/chat-with-astrologer");
        }, 2000);
      } else {
        setMessage(res.data.message || "❌ Something went wrong.");
      }
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message || "❌ Invalid or expired link."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="reset-password-container">
        <div className="reset-password-box">
          <h1>Reset Password</h1>
          <p>
            Enter your new password below. Password must be at least 6
            characters.
          </p>

          <div className="form-field">
            <input
              type="password"
              placeholder="Enter new password"
              className="common-input-filed"
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="form-field">
            <input
              type="password"
              placeholder="Confirm new password"
              className="common-input-filed"
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            onClick={handleResetSubmit}
            disabled={loading}
            className="submit-btn"
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>

          {message && (
            <div
              className={`message-box ${
                message.includes("✅") ? "success" : "error"
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
