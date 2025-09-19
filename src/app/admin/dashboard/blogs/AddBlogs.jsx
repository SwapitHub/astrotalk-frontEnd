import React, { useState, useEffect } from "react";
import axios from "axios";
import SummernoteEditor from "@/app/component/SummernoteEditor";
import Loader from "@/app/component/Loader";

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
  const [loader, setLoader] = useState(false)

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
setLoader(true)
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
    }finally{
      setLoader(false)
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
    <div style={{ padding: "2rem" }}>
      {loader && <Loader/>}
      <h2>{editingId ? "Edit Blog" : "Add New Blog"}</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <label>Title</label>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <br />
        <label>Slug</label>
        <input
          name="slug"
          placeholder="Slug (optional)"
          value={form.slug}
          onChange={handleChange}
        />
        <br />
        <label>Short Description</label>
        <input
          name="shortDescription"
          placeholder="Short Description"
          value={form.shortDescription}
          onChange={handleChange}
        />
        <br />
        <label>Content</label>
        <SummernoteEditor
          value={form.content}
          onChange={(content) => setForm((prev) => ({ ...prev, content }))}
        />
        <br />
        <label>Author</label>
        <input
          name="author"
          placeholder="Author"
          value={form.author}
          onChange={handleChange}
        />
        <br />
        <label>Cover Image</label>
        <input
          type="file"
          name="coverImage"
          accept="image/*"
          onChange={handleFileChange}
          key={form.coverImage ? form.coverImage.name : "file-input"}
        />
        <img src={form?.coverImage} alt="" />
        <br />
        <label>Select Category</label>
        <select
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
        <br />

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
                  {categories.find((cat) => cat._id === blog.category)?.name ||
                    "N/A"}
                </td>
                <td>
                  {blog.coverImage && (
                    <img
                      src={blog.coverImage}
                      alt="cover"
                      style={{ width: "100px", height: "60px", objectFit: "cover" }}
                    />
                  )}
                </td>
                <td>{new Date(blog.createdAt).toLocaleString()}</td>
                <td>
                  <button onClick={() => handleEdit(blog)}>Edit</button>
                  <button onClick={() => handleDelete(blog._id)}>Delete</button>
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

      {/* Pagination Controls */}
      <div style={{ marginTop: "1rem" }}>
        <button
          disabled={!pagination.hasPrevPage}
          onClick={() => handlePageChange(pagination.currentPage - 1)}
        >
          Previous
        </button>
        <span style={{ margin: "0 10px" }}>
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
