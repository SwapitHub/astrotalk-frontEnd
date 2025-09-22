import React, { useState, useEffect } from "react";
import axios from "axios";
import SummernoteEditor from "@/app/component/SummernoteEditor";
import Loader from "@/app/component/Loader";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin7Fill } from "react-icons/ri";

const API = process.env.NEXT_PUBLIC_WEBSITE_URL;

const AddBlogs = () => {
  const [form, setForm] = useState({
    title: "",
    slug: "",
    shortDescription: "",
    content: "",
    author: "Admin",
    coverImage: null,
    category: "",
  });

  const [categories, setCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loader, setLoader] = useState(false);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    totalBlogs: 0,
  });

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API}/get-all-category-blogs`);
      setCategories(res.data);
    } catch (err) {
      console.error("Fetch categories failed:", err);
    }
  };

  const fetchBlogs = async (page = 1, limit = 1) => {
    try {
      const res = await axios.get(`${API}/get-add-blogs-all`, {
        params: { page, limit },
      });
      setBlogs(res.data.blogs);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error("Fetch blogs failed:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchBlogs(pagination.currentPage);
  }, [pagination.currentPage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({
      ...prev,
      coverImage: e.target.files[0] || null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    if (!form.title || !form.content) {
      return setError("Title and content are required.");
    }

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("slug", form.slug);
      formData.append("shortDescription", form.shortDescription);
      formData.append("content", form.content);
      formData.append("author", form.author);
      formData.append("category", form.category);

      if (form.coverImage) {
        formData.append("image", form.coverImage);
      }

      if (editingId) {
        await axios.put(`${API}/put-add-blogs-update/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post(`${API}/post-add-blogs`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      fetchBlogs(pagination.currentPage);
      setForm({
        title: "",
        slug: "",
        shortDescription: "",
        content: "",
        author: "Admin",
        coverImage: null,
        category: "",
      });
      setEditingId(null);
      setError("");
    } catch (err) {
      console.error("Error submitting blog:", err);
      setError(err.response?.data?.error || "Submission failed.");
    } finally {
      setLoader(false);
    }
  };

  const handleEdit = (blog) => {
    setEditingId(blog._id);
    setForm({
      title: blog.title,
      slug: blog.slug,
      shortDescription: blog.shortDescription,
      content: blog.content,
      author: blog.author || "Admin",
      coverImage: blog.coverImage,
      category: blog.category || "",
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/delete-add-blogs/${id}`);
      fetchBlogs(pagination.currentPage);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: newPage }));
    }
  };

  return (
    <div className="add-blogs-outer-admin">
      {loader && <Loader />}
      <h2>{editingId ? "Edit Blog" : "Add New Blog"}</h2>
      <div className="admin-form-box">
        <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
          <div className="form-field">
            <div className="label-content">
              <label>Title</label>
            </div>
            <input
              className="common-input-filed"
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <div className="label-content">
              <label>Slug</label>
            </div>
            <input
              className="common-input-filed"
              name="slug"
              placeholder="Slug (optional)"
              value={form.slug}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <div className="label-content">
              <label>Short Description</label>
            </div>
            <input
              className="common-input-filed"
              name="shortDescription"
              placeholder="Short Description"
              value={form.shortDescription}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <div className="label-content">
              <label>Content</label>
            </div>
            <SummernoteEditor
              value={form.content}
              onChange={(content) => setForm((prev) => ({ ...prev, content }))}
            />
          </div>
          <div className="form-field">
            <div className="label-content">
              <label>Author</label>
            </div>
            <input
              className="common-input-filed"
              name="author"
              placeholder="Author"
              value={form.author}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <div className="label-content">
              <label>Cover Image</label>
            </div>
            <input
              className="common-input-filed"
              type="file"
              name="coverImage"
              accept="image/*"
              onChange={handleFileChange}
              key={form.coverImage ? form.coverImage.name : "file-input"}
            />
            <img src={form?.coverImage} alt="" />
          </div>
          <div className="form-field">
            <div className="label-content">
              <label>Select Category</label>
            </div>
            <select
              className="common-input-filed"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}

          <button type="submit">{editingId ? "Update" : "Create"} Blog</button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({
                  title: "",
                  slug: "",
                  shortDescription: "",
                  content: "",
                  author: "Admin",
                  coverImage: null,
                  category: "",
                });
                setError("");
              }}
            >
              Cancel
            </button>
          )}
        </form>
      </div>
      <div className="bottom-table">
        <h2>All Blogs</h2>
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Title</th>
              <th>Slug</th>
              <th>Category</th>
              <th>Cover Image</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.length > 0 ? (
              blogs.map((blog) => (
                <tr key={blog._id}>
                  <td>{blog.title}</td>
                  <td>{blog.slug}</td>
                  <td>
                    {categories.find((cat) => cat._id === blog.category)
                      ?.name || "N/A"}
                  </td>
                  <td>
                    {blog.coverImage && (
                      <img
                        src={blog.coverImage}
                        alt="cover"
                        style={{
                          width: "100px",
                          height: "60px",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </td>
                  <td>{new Date(blog.createdAt).toLocaleString()}</td>
                  <td>
                    <div className="edit-delete-btn">
                    <button onClick={() => handleEdit(blog)}><FaEdit/></button>
                    <button onClick={() => handleDelete(blog._id)}>
                      <RiDeleteBin7Fill/>
                    </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No blogs found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          disabled={!pagination.hasPrevPage}
          onClick={() => handlePageChange(pagination.currentPage - 1)}
        >
          Previous
        </button>
        <span>
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>
        <button
          disabled={!pagination.hasNextPage}
          onClick={() => handlePageChange(pagination.currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AddBlogs;
