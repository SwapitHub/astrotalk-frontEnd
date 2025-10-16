import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const EditOrderUserDetail = ({
  editDetailOrder,
  setShowOrderPopUp,
  setLoading,
  fetchTransactions,
}) => {
  const [userData, setUserData] = useState({
    city: "",
    state: "",
    country: "",
    pin: "",
    name: "",
    mobile: "",
    altMobile: "",
    email: "",
    flat: "",
    locality: "",
    landmark: "",
  });

  // Initialize userData when editDetailOrder changes
  useEffect(() => {
    if (editDetailOrder?.addresses?.[0]) {
      setUserData({ ...editDetailOrder.addresses[0] });
    }
  }, [editDetailOrder]);

  const handleChange = (field, value) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async () => {
    if (!editDetailOrder?.order_id) return;

    try {
      setLoading(true);

      // Prepare full addresses array with updated address
      const updatedAddresses = [{ ...userData }];

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/update-any-field-payment-shop/${editDetailOrder.order_id}`,
        {
          addresses: updatedAddresses, // <-- Send the full addresses array
        }
      );

      if (response.status === 200) {
        toast.success("Profile updated successfully");
        fetchTransactions();
      } else {
        toast.error("Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating user:", err);
      toast.error("An error occurred while updating.");
    } finally {
      setLoading(false);
      setShowOrderPopUp(false);
    }
  };

  return (
    <main className="Edit-Order-User-detail">
      <span className="close" onClick={() => setShowOrderPopUp(false)}>
        X
      </span>

      <h1 className="common-h1-heading">Update User Order Detail</h1>

      <div className="profile-table">
        {[
          "name",
          "mobile",
          "altMobile",
          "email",
          "flat",
          "locality",
          "landmark",
          "city",
          "state",
          "country",
          "pin",
        ].map((field) => (
          <div key={field} className="common-profile">
            <div className="name">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </div>
            <div className="input-outer">
              <input
                className="common-input-field"
                type="text"
                value={userData[field] || ""}
                onChange={(e) => handleChange(field, e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="reg-submit-button" style={{ marginTop: "20px" }}>
        <button onClick={handleUpdate}>Edit User Order</button>
      </div>
    </main>
  );
};

export default EditOrderUserDetail;
