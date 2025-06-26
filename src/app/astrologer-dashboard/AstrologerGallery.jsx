"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../component/Loader";

const AstrologerGallery = () => {
  const [galleryListData, setGalleryListData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [multipleImages, setMultipleImages] = useState([]);

  const fetchGalleryList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/get-gallery-astrologer`
      );
      setGalleryListData(response.data);
    } catch (error) {
      console.error("Fetch gallery list error:", error);
      toast.error("Failed to fetch gallerys.", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  const handleMultipleChange = (e) => {
    setMultipleImages([...e.target.files]);
  };

  const handleSubmitAddGallery = async () => {
    setLoading(true);
    const formData = new FormData();

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
      console.log("Upload success:", response.data);
      if (response.data?.message == "success") {
        fetchGalleryList();
        setMultipleImages(" ");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to delete gallery. please try again", { position: "top-right" });
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
      console.log("res-data", res);

      if (res.status == 200) {
        toast.success("gallery removed successfully!", {
          position: "top-right",
        });
        fetchGalleryList(); // Refresh list after delete
      }
    } catch (err) {
      console.error("Delete gallery error:", err);
      toast.error("Failed to delete gallery. please try again", { position: "top-right" });
       setLoading(false);
    } finally {
      setLoading(true);
    }
  };

  useEffect(() => {
    fetchGalleryList();
  }, []);

  return (
    <div className="AddLanguage gallery-main">
      <div className="language-add-data">
        <h2>Create New gallery</h2>

        <label>Choose Multiple Images:</label>
        <input type="file" multiple onChange={handleMultipleChange} />

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
                <img src={item?.img_url} alt="" />
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
