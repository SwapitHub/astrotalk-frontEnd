"use client";
import Loader from "@/app/component/Loader";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AddFooter = () => {
  const [footerProductListData, setFooterProductListData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmitAddFooter = async () => {
    const footerProductName = document
      .getElementById("products_name")
      .value.trim();
    const footerProductLink = document
      .getElementById("products_link")
      .value.trim();

    if (!footerProductName || !footerProductLink) {
      toast.warning("Please enter a footerProduct name and Link.", {
        position: "top-right",
      });
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/post-footerProduct-astrologer`,
        {
          footerProductName,
          footerProductLink,
        }
      );

      if (response.data.message === "success") {
        toast.success("footerProduct added successfully!", {
          position: "top-right",
        });
        document.getElementById("products_name").value = "";
        document.getElementById("products_link").value = "";
        fetchFooterProductList(); // Refresh list
      }
    } catch (error) {
      console.error("Add footerProduct error:", error);
      toast.error("Failed to add footerProduct.", { position: "top-right" });
    }
  };

  const fetchFooterProductList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/get-footerProduct-astrologer`
      );
      setFooterProductListData(response.data);
    } catch (error) {
      console.error("Fetch footerProduct list error:", error);
      toast.error("Failed to fetch footerProducts.", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  const deleteFooterProduct = async (id) => {
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/delete-footerProduct-astrologer/${id}`
      );

      if (res.data.message === "success") {
        toast.success("footerProduct removed successfully!", {
          position: "top-right",
        });
        fetchFooterProductList(); // Refresh list after delete
      }
    } catch (err) {
      console.error("Delete footerProduct error:", err);
      toast.error("Failed to delete footerProduct.", { position: "top-right" });
    }
  };

  useEffect(() => {
    fetchFooterProductList();
  }, []);

  return (
    <div className="AddLanguage AddFooter">
      <div className="language-add-data">
        <h2>Shop our products</h2>
        <div className="Shop-products">
          <label>Product Name</label>
          <input type="text" placeholder="product name" id="products_name" />
        </div>
        <div className="Shop-products">
          <label>Product Link</label>
          <input type="text" placeholder="product Link" id="products_link" />
        </div>
        <button onClick={handleSubmitAddFooter}>Add Products Name</button>
      </div>

      <div className="language-list">
        <h2>Available Products Name</h2>
        {loading ? (
          <Loader />
        ) : (
          <ul>
            {footerProductListData.map((item) => (
              <li key={item._id}>
                <div className="product-detail">
                <div className="link-product">Name : {item.footerProductName}</div>
                <div className="link-product">Link : {item.footerProductLink}</div>
                </div>
                <button onClick={() => deleteFooterProduct(item._id)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AddFooter;
