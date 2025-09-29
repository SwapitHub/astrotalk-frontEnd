"use client";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../component/Loader";
import Image from "next/image";

const AstrologerGallery = ({ astrologerData }) => {
  const [galleryListData, setGalleryListData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [multipleImages, setMultipleImages] = useState([]);
  const fileInputRef = useRef(null);

  const fetchGalleryList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/get-gallery-astrologer/?mobileNumber=${astrologerData?.mobileNumber}`
      );
      setGalleryListData(response.data);
      console.log(response);
    } catch (error) {
      console.error("Fetch gallery list error:", error);
      // toast.error("Failed to fetch gallery.", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryList();
  }, []);

  const handleMultipleChange = (e) => {
    setMultipleImages([...e.target.files]);
  };

  const handleSubmitAddGallery = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("nameAstro", astrologerData?.name);
    formData.append("mobileNumber", astrologerData?.mobileNumber);
    // Append multiple images
    multipleImages.forEach((file) => {
      formData.append("multipleImages", file);
    });

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/post-gallery-astrologer`, // Make sure this is correctly set
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      if (response.data?.message == "success") {
        toast.success("Added successfully image!", {
          position: "top-right",
        });
        setMultipleImages([]);
        fetchGalleryList();
      }
    } catch (error) {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setMultipleImages([]);
      toast.error("Image is not upload. please try again", {
        position: "top-right",
      });
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const deleteGallery = async (id) => {
    setLoading(true);
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/delete-gallery-astrologer/?cloudinary_id=${id}`
      );

      if (res.status == 200) {
        toast.success("gallery removed successfully!", {
          position: "top-right",
        });
        fetchGalleryList(); // Refresh list after delete
      }
    } catch (err) {
      toast.error("Failed to delete gallery. please try again", {
        position: "top-right",
      });
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="AddLanguage gallery-main">
      <div className="language-add-data">
        <h2>Create New gallery</h2>

        <label>Choose Multiple or Single Images:</label>
        <input
          type="file"
          multiple
          onChange={handleMultipleChange}
          ref={fileInputRef}
        />

        <button onClick={handleSubmitAddGallery}>Add gallery</button>
      </div>

      <div className="language-list">
        <h2>Available Gallery</h2>
        {loading ? (
          <Loader />
        ) : (
          <ul>
            {galleryListData[0]?.multipleImages?.map((item) => (
              <li key={item._id}>
                <Image
                  src={`${process.env.NEXT_PUBLIC_WEBSITE_URL}${item?.img_url}`}
                  alt="Astro image"
                  width={100}
                  height={100}
                  style={{ objectFit: "cover" }}
                />
                {/* <img
                  src={`${process.env.NEXT_PUBLIC_WEBSITE_URL}${item?.img_url}`}
                  alt="Astro image"
                /> */}
                <button onClick={() => deleteGallery(item?.cloudinary_id)}>
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

export default AstrologerGallery;
