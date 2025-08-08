"use client";
import Loader from "@/app/component/Loader";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const BannerHome = () => {
  const [bannerHomeListData, setBannerHomeListData] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  console.log(bannerHomeListData);

  const fetchBannerHomeList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/get-banner-home`
      );
      setBannerHomeListData(response.data);
    } catch (error) {
      console.error("Fetch bannerHome list error:", error);
      toast.error("Failed to fetch bannerHome.", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBannerHomeList();
  }, []);

  const handleSubmitAddBannerHome = async () => {
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

    if (!file || !heading || !description || !banner_btn_link || !banner_btn_name) {
      toast.error("Please fill all fields and select an image", {
        position: "top-right",
      });
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("banner_heading", heading);
    formData.append("banner_desc", description);
    formData.append("banner_btn_link", banner_btn_link);
    formData.append("banner_btn_name", banner_btn_name);
    formData.append("image", file);

    try {
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
        toast.success("Banner added successfully!", { position: "top-right" });

        // Reset inputs
        imageInput.value = "";
        headingInput.value = "";
        descInput.value = "";
        bannerBtnLink.value = "";
        bannerBtnName.value = "";

        fetchBannerHomeList();
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Image not uploaded. Please try again", {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteBannerHome = async (id) => {
    setLoading(true);
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/delete-bannerHome/?cloudinary_id=${id}`
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

  return (
    <div className="AddLanguage gallery-main banner-home">
      <div className="language-add-data">
        <h2>Create New Banner</h2>

        <div className="banner-main">
          <div className="banner-inner">
            <label>Choose Image:</label>
            <input
              type="file"
              id="banner_image"
              accept="image/*"
              ref={fileInputRef}
            />
          </div>
          <div className="banner-inner">
            <label>Heading Text:</label>
            <input
              type="text"
              id="banner_heading"
              placeholder="Enter heading"
            />
          </div>

          <div className="banner-inner">
            <label>Button Name:</label>
            <input
              type="text"
              id="banner_btn_name"
              placeholder="Enter btn name"
            />
          </div>
          <div className="banner-inner">
            <label>Button Link:</label>
            <input
              type="text"
              id="banner_btn_link"
              placeholder="Enter btn Link"
            />
          </div>
          <div className="banner-inner">
            <label>Description:</label>
            <input
              type="text"
              id="banner_desc"
              placeholder="Enter description"
            />
          </div>
        </div>

        <button onClick={handleSubmitAddBannerHome}>Add Banner</button>
      </div>

      <div className="language-list">
        <h2>Available Banners</h2>
        {loading ? (
          <Loader />
        ) : (
          <ul>
            {bannerHomeListData?.map((item) => (
              <li key={item._id}>
                <span>{item?.banner_heading}</span>
                <span>{item?.banner_desc}</span>
                <span>{item?.banner_btn_name}</span>
                <span>{item?.banner_btn_link}</span>
                <img src={item?.singleImages?.img_url} alt="banner" />
                <button
                  onClick={() =>
                    deleteBannerHome(item?.singleImages?.cloudinary_id)
                  }
                >
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

export default BannerHome;
