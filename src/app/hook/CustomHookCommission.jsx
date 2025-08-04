import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import secureLocalStorage from "react-secure-storage";

const CustomHookCommission = ({ fetchUrl, addUrl, deleteUrl, valueKey }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(fetchUrl);
      setData(res.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to fetch commissions", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  // Add one
  const addCommission = async (value) => {
    if (!value) {
      toast.warning("Please enter a valid value", { position: "top-right" });
      return;
    }

    try {
      const res = await axios.post(addUrl, { [valueKey]: value });
      if (res.data.message === "success") {
        toast.success("Commission added successfully", {
          position: "top-right",
        });
        fetchData();
      }
    } catch (err) {
      console.error("Add error:", err);
      toast.error("Failed to add commission", { position: "top-right" });
    }
  };

  // Delete one
  const deleteCommission = async (id) => {
    try {
      const res = await axios.delete(`${deleteUrl}/${id}`);
      if (res.data.message === "success") {
        toast.success("Commission deleted successfully", {
          position: "top-right",
        });
        fetchData();
        secureLocalStorage.removeItem("buttonStatus");
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete commission", { position: "top-right" });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    addCommission,
    deleteCommission,
  };
};

export default CustomHookCommission;
