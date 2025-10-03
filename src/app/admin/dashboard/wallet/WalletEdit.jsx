import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const WalletEdit = ({
  userMobile,
  setAddActiveClassEdit,
  setLoading,
  fetchTransactions,
}) => {
  const [userData, setUserData] = useState({});

  // Get today's date for DOB max
  const todayDate = new Date().toISOString().split("T")[0];

  // Fetch user details

  useEffect(() => {
    if (userMobile) {
      fetchUserDetail();
    }
  }, [userMobile]);

  const fetchUserDetail = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/user-login-detail/${userMobile}`
      );
      setUserData(response.data.data || {});
    } catch (err) {
      console.error("Error fetching user:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle input change
  const handleChange = (field, value) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  // Update user
  const handleUpdate = async () => {
    if (!userMobile) return;
    try {
      setLoading(true);
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/update-user/${userMobile}`,
        {
          name: userData.name,
          gender: userData.gender,
          dateOfBirth: userData.dateOfBirth,
          reUseDateOfBirth: userData.reUseDateOfBirth || "",
          placeOfBorn: userData.placeOfBorn,
          language: userData.language,
        }
      );
      if (response.data.message === "success") {
        toast.success("Profile updated successfully");
        fetchTransactions();
        setAddActiveClassEdit(false);
      }
    } catch (err) {
      console.error("Error updating user:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main-content wallet-edit-main">
      <span
        className="close"
        onClick={() => {
          setAddActiveClassEdit(false);
        }}
      >
        X
      </span>
      <section className="user-update-section">
        <div className="container">
          <h1 className="common-h1-heading">Update User Profile</h1>

          <div className="profile-table">
            <div className="inner-profile-table">
              <div className="common-profile">
                <div className="name">Name</div>
                <div className="input-outer">
                  <input
                    className="common-input-filed"
                    type="text"
                    value={userData?.name || ""}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </div>
              </div>

              <div className="common-profile">
                <div className="gender">Gender</div>
                <div className="input-outer">
                  <select
                    className="common-input-filed"
                    value={userData?.gender || ""}
                    onChange={(e) => handleChange("gender", e.target.value)}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="common-profile">
                <div className="date-of-birth">Date of Birth</div>
                <div className="input-outer">
                  <input
                    className="common-input-filed"
                    type="date"
                    max={todayDate}
                    value={userData?.dateOfBirth || ""}
                    onChange={(e) =>
                      handleChange("dateOfBirth", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="common-profile">
                <div className="time-of">Time of Birth</div>
                <div className="input-outer">
                  <input
                    className="common-input-filed"
                    type="time"
                    value={userData?.reUseDateOfBirth || ""}
                    onChange={(e) =>
                      handleChange("reUseDateOfBirth", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="common-profile">
                <div className="place-of">Place of Birth</div>
                <div className="input-outer">
                  <input
                    className="common-input-filed"
                    type="text"
                    value={userData?.placeOfBorn || ""}
                    onChange={(e) =>
                      handleChange("placeOfBorn", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="common-profile">
                <div className="language">Language</div>
                <div className="input-outer">
                  <select
                    className="common-input-filed"
                    value={userData?.language || ""}
                    onChange={(e) => handleChange("language", e.target.value)}
                  >
                    <option value="">Select Language</option>
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Bengali">Bengali</option>
                    <option value="Assamese">Assamese</option>
                    <option value="Punjabi">Punjabi</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="reg-sumbit-button">
            <button onClick={handleUpdate}>Edit user detail</button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default WalletEdit;
