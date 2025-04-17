"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import secureLocalStorage from "react-secure-storage";

const Admin = () => {
  const router = useRouter();
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const adminSegment = segments[0];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const admin_id = secureLocalStorage.getItem("admin_id");

  useEffect(() => {
    // Redirect to dashboard if already logged in
    if (adminSegment === "admin" &&  admin_id) {
      router.push("/admin/dashboard");
    }
  }, [adminSegment, admin_id, router]);

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/admin`);
      if (!response.ok) throw new Error("Failed to fetch admin data");

      const admins = await response.json();
      const admin = admins[0];

      if (admin?.email === email && admin?.password === password) {
        secureLocalStorage.setItem("admin_id", admin._id);
        router.push("/admin/dashboard");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="container">
      <div className="admin-popup-main">
        <div className="admin-popup-outer-inner">
          <div className="admin-detail-popup">
            <label>Admin Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Admin Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <div className="error-message">{error}</div>}
            <button onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
