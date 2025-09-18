"use client";
import Loader from "@/app/component/Loader";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AddBlogsCategory = () => {
  const [blogsCategoryName, setBlogsCategoryName] = useState("");
  const [blogsCategoryListData, setBlogsCategoryListData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle input change
  const handleInputChange = (e) => {
    setBlogsCategoryName(e.target.value);
  };

  // Add a new blog category
  const handleSubmitAddBlogsCategory = async () => {
    if (!blogsCategoryName.trim()) {
      return setMessage("BlogsCategory Field Is Required!");
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/post-category-blogs`,
        { name: blogsCategoryName }
      );

      if (response.data.message === "success") {
        toast.success("BlogsCategory added successfully!", { position: "top-right" });
        setBlogsCategoryName(""); // Clear input field after successful addition
        setBlogsCategoryListData((prevList) => [
          ...prevList,
          response.data.data,
        ]); // Add new category to the list without needing to refetch
        setMessage(""); // Clear error message if any
      }
    } catch (error) {
      console.error("Add BlogsCategory error:", error);
      toast.error("Failed to add BlogsCategory.", { position: "top-right" });
    }
  };

  // Fetch all blog categories
  const fetchBlogsCategoryList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/get-all-category-blogs`
      );
      setBlogsCategoryListData(response.data);
    } catch (error) {
      console.error("Fetch BlogsCategory list error:", error);
      toast.error("Failed to fetch BlogsCategorys.", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  // Delete a blog category
  const deleteBlogsCategory = async (id) => {
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/delete-update-category-blogs/${id}`
      );

      if (res.data.message === "success") {
        toast.success("BlogsCategory removed successfully!", { position: "top-right" });
        setBlogsCategoryListData((prevList) =>
          prevList.filter((item) => item._id !== id)
        ); // Optimistically remove the deleted category
      }
    } catch (err) {
      console.error("Delete BlogsCategory error:", err);
      toast.error("Failed to delete BlogsCategory.", { position: "top-right" });
    }
  };

  useEffect(() => {
    fetchBlogsCategoryList(); // Fetch the initial list of categories on component mount
  }, []);

  return (
    <div className="AddBlogsCategory">
      <div className="BlogsCategory-add-data">
        <h2>Add a New BlogsCategory</h2>
        <div className="admin-form-box">
          <div className="form-field">
            <input
              type="text"
              placeholder="BlogsCategory Name"
              value={blogsCategoryName}
              onChange={handleInputChange}
              className="common-input-filed"
              aria-label="Category Name"
            />
          </div>
          <button onClick={handleSubmitAddBlogsCategory}>Add BlogsCategory</button>
          {message && <p className="error-msg">{message}</p>}
        </div>
      </div>

      <div className="BlogsCategory-list">
        <h2>Available Blog Categories</h2>
        {loading ? (
          <Loader />
        ) : (
          <ul>
            {blogsCategoryListData.length === 0 ? (
              <li>No categories available.</li>
            ) : (
              blogsCategoryListData.map((item) => (
                <li key={item._id}>
                  {item.name}
                  <button onClick={() => deleteBlogsCategory(item._id)}>Remove</button>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AddBlogsCategory;
