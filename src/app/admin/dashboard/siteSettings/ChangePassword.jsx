import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ChangePassword = () => {
  const [email, setEmail] = useState("admin@gmail.com");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (oldPassword == "" || newPassword == "" || confirmPassword == "") {
      return setMessage("All Fields Are Required !");
    } else if (newPassword !== confirmPassword) {
      return setMessage("New Passwords Do Not Match !");
    }

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/admin/change-password`,
        {
          email,
          oldPassword,
          newPassword,
        }
      );
      console.log(res);
      if (res.status == 200) {
        setMessage("");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        toast.success("Password Update Successfully", {
          position: "top-right",
        });
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="change-password">
      <h1>Change Admin Dashboard Password</h1>
      <div className="form-field">
        <div className="label-content">
          <label>Old Password</label>
        </div>
        <input
          class="common-input-filed"
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
      </div>
      <div className="form-field">
        <div className="label-content">
          <label>New Password</label>
        </div>
        <input
          class="common-input-filed"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <div className="form-field">
        <div className="label-content">
          <label>Confirm Password</label>
        </div>
        <input
          class="common-input-filed"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <button onClick={handleSubmit}>Submit</button>
      <p>{message}</p>
    </div>
  );
};

export default ChangePassword;
