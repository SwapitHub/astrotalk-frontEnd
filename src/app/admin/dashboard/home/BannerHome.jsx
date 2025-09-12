"use client";

import Loader from "@/app/component/Loader";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { MdDelete, MdEditSquare } from "react-icons/md";
import { toast } from "react-toastify";

const BannerHome = () => {
  const [bannerHomeListData, setBannerHomeListData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fileInputRef = useRef(null);

  // Fetch all banners
  const fetchBannerHomeList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/get-banner-home`
      );
      setBannerHomeListData(response.data);
    } catch (error) {
      console.error("Fetch bannerHome list error:", error);
      toast.error("Failed to fetch banners.", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBannerHomeList();
  }, []);

  // Add or Update banner
  const handleBannerSubmit = async () => {
    setLoading(true);

    const imageInput = document.getElementById("banner_image");
    const headingInput = document.getElementById("banner_heading");
    const descInput = document.getElementById("banner_desc");
    const bannerBtnLink = document.getElementById("banner_btn_link");
    const bannerBtnName = document.getElementById("banner_btn_name");

    const file = imageInput?.files[0];
    const heading = headingInput?.value;
    const description = descInput?.value;
    const banner_btn_link = bannerBtnLink?.value;
    const banner_btn_name = bannerBtnName?.value;

    if (!heading || !description || !banner_btn_link || !banner_btn_name) {
      toast.error("Please fill all fields", { position: "top-right" });
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("banner_heading", heading);
    formData.append("banner_desc", description);
    formData.append("banner_btn_link", banner_btn_link);
    formData.append("banner_btn_name", banner_btn_name);

    if (file) {
      formData.append("image", file);
    }

    try {
      if (isEditMode && editingId) {
        formData.append("id", editingId);

        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}/put-banner-home`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          toast.success("Banner updated successfully!", {
            position: "top-right",
          });
        }
      } else {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}/post-banner-home`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data?.message === "success") {
          toast.success("Banner added successfully!", {
            position: "top-right",
          });
        }
      }

      // Reset form and reload
      resetForm();
      fetchBannerHomeList();
    } catch (error) {
      console.error("Banner submit error:", error);
      toast.error("Something went wrong", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  // Delete banner
  const deleteBannerHome = async (cloudinary_id) => {
    setLoading(true);
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/delete-bannerHome/?cloudinary_id=${cloudinary_id}`
      );

      if (res.status === 200) {
        toast.success("Banner removed successfully!", {
          position: "top-right",
        });
        fetchBannerHomeList();
      }
    } catch (err) {
      toast.error("Failed to delete banner. Please try again", {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  // Edit banner
  const handleEdit = (item) => {
    setIsEditMode(true);
    setEditingId(item._id);

    document.getElementById("banner_heading").value = item.banner_heading || "";
    document.getElementById("banner_desc").value = item.banner_desc || "";
    document.getElementById("banner_btn_name").value = item.banner_btn_name || "";
    document.getElementById("banner_btn_link").value = item.banner_btn_link || "";

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    toast.info("Edit mode activated", { position: "top-right" });
  };

  // Reset form
  const resetForm = () => {
    setIsEditMode(false);
    setEditingId(null);

    document.getElementById("banner_heading").value = "";
    document.getElementById("banner_desc").value = "";
    document.getElementById("banner_btn_name").value = "";
    document.getElementById("banner_btn_link").value = "";
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="AddLanguage gallery-main banner-home">
      <div className="language-add-data">
        <h2>{isEditMode ? "Update Banner" : "Create New Banner"}</h2>
        <div className="admin-form-box">
          <div className="form-field">
            <div className="label-content"><label>Choose Image:</label></div>
            <input
              className="common-input-filed"
              type="file"
              id="banner_image"
              accept="image/*"
              ref={fileInputRef}
            />
          </div>
          <div className="form-field">
            <div className="label-content"><label>Heading Text:</label></div>
            <input
              className="common-input-filed"
              type="text"
              id="banner_heading"
              placeholder="Enter heading"
            />
          </div>

          <div className="form-field">
            <div className="label-content"><label>Button Name:</label></div>
            <input
              className="common-input-filed"
              type="text"
              id="banner_btn_name"
              placeholder="Enter btn name"
            />
          </div>
          <div className="form-field">
            <div className="label-content"><label>Button Link:</label></div>
            <input
              className="common-input-filed"
              type="text"
              id="banner_btn_link"
              placeholder="Enter btn Link"
            />
          </div>
          <div className="form-field">
            <div className="label-content"><label>Description:</label></div>
            <input
              className="common-input-filed"
              type="text"
              id="banner_desc"
              placeholder="Enter description"
            />
          </div>

          <button onClick={handleBannerSubmit}>
            {isEditMode ? "Update Banner" : "Add Banner"}
          </button>

          {isEditMode && (
            <button
              style={{ marginLeft: "10px", backgroundColor: "#999" }}
              onClick={resetForm}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </div>

      <div className="language-list">
        <h2>Available Banners</h2>
        {loading ? (
          <Loader />
        ) : (
          <ul>
            {bannerHomeListData?.map((item) => (
              <li key={item._id}>
                <span className="banner-content">
                  <span className="banner-heading">{item?.banner_heading}</span>
                  <span className="banner-desc">{item?.banner_desc}</span>
                  <span className="banner-btn">
                    <span className="btn-text">{item?.banner_btn_name}</span>
                    <span className="btn-link">{item?.banner_btn_link}</span>
                  </span>
                   <div className="edit-delete-btn">
                  <button
                    onClick={() =>
                      deleteBannerHome(item?.singleImages?.cloudinary_id)
                    }
                  >
                    <MdDelete />
                  </button>
                  <button onClick={() => handleEdit(item)}><MdEditSquare /></button>
                  </div>
                </span>
                <span className="banner-img">
                  <img src={item?.singleImages?.img_url} alt="banner" />
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default BannerHome;
