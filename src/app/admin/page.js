"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import secureLocalStorage from "react-secure-storage";
import Loader from "../component/Loader";

const Admin = () => {
  const router = useRouter();
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const adminSegment = segments[0];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const admin_id = secureLocalStorage.getItem("admin_id");

  useEffect(() => {
    // Redirect to dashboard if already logged in
    if (adminSegment === "admin" && admin_id) {
      router.push("/admin/dashboard");
    }
  }, [adminSegment, admin_id, router]);

  const handleSubmit = async () => {
    if (!email || !password) return setError("Please enter email and password");
    // setIsLoading(true); // Start loader
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/admin`
      );
      if (!response.ok) throw new Error("Failed to fetch admin data");

      const admins = await response.json();
      const admin = admins[0];

      if (admin?.email === email && admin?.password === password) {
        setIsLoading(true); // Start loader
        secureLocalStorage.setItem("admin_id", admin._id);
        router.push("/admin/dashboard");
        window.dispatchEvent(new Event("admin_id_updated"));
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
    } 
    // finally {
    //   setIsLoading(false); // Stop loader
    // }
  };

  return (
    <div className="container">
      <div className="admin-popup-main">
        {isLoading && <Loader />}
        <div className="admin-popup-outer-inner">
          <div className="admin-detail-popup">
            <div className="admin-banner">
              <div className="admin-login-logo">
                <img src="/astrotalk-logo.webp" alt="" />
              </div>
              <div className="admin-login-left-content">
                <h1>Welcome to Astrotalk</h1>
                <p>Lorem Ipsum content here</p>
              </div>
            </div>
            <div className="admin-text admin-login-form">
              <div className="form-field">
                <label>Admin Email</label>
                <input
                  className="common-input-filed"
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-field">
                <label>Admin Password</label>
                <input
                  className="common-input-filed"
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <div className="error-message">{error}</div>}
              <button onClick={handleSubmit}>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
