import React, { useState, useEffect } from "react";
import axios from "axios";
import SummernoteEditor from "@/app/component/SummernoteEditor";

const API = process.env.NEXT_PUBLIC_WEBSITE_URL;

const AddBlogs = () => {
  const [form, setForm] = useState({
    title: "",
    slug: "",
    shortDescription: "",
    content: "",
    author: "Admin",
    tags: "",
    coverImage: null, // This will hold the File object now
    category: "",
  });
  console.log(form, "form");

  const [categories, setCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API}/get-all-category-blogs`);
      setCategories(res.data);
    } catch (err) {
      console.error("Fetch categories failed:", err);
    }
  };

  // Fetch blogs
  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${API}/get-add-blogs-all`);
      setBlogs(res.data.blogs);
      console.log(res);
      
    } catch (err) {
      console.error("Fetch blogs failed:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchBlogs();
  }, []);

  // Handle text input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input change for coverImage
  const handleFileChange = (e) => {
    setForm((prev) => ({
      ...prev,
      coverImage: e.target.files[0] || null,
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

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

      // Tags - send as JSON string if backend expects array
      const tagsArray = form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
      formData.append("tags", JSON.stringify(tagsArray));

      // Append image file if available
      if (form.coverImage) {
        formData.append("image", form.coverImage);
      }

      if (editingId) {
        await axios.put(
          `${API}/put-add-blogs-update/${editingId}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        await axios.post(`${API}/post-add-blogs`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      fetchBlogs();
      // Reset form after submit
      setForm({
        title: "",
        slug: "",
        shortDescription: "",
        content: "",
        author: "Admin",
        tags: "",
        coverImage: null,
        category: "",
      });
      setEditingId(null);
      setError("");
    } catch (err) {
      console.error("Error submitting blog:", err);
      setError(err.response?.data?.error || "Submission failed.");
    }
  };

  // Edit blog - populate form with existing blog data
  const handleEdit = (blog) => {
    console.log(blog);
    
    setEditingId(blog._id);
    setForm({
      title: blog.title,
      slug: blog.slug,
      shortDescription: blog.shortDescription,
      content: blog.content,
      author: blog.author || "Admin",
      tags: blog.tags.join(", "),
      coverImage: null, // For edit, user can upload new image if desired
      category: blog.category || "",
    });
  };

  // Delete blog
  const handleDelete = async (id) => {

    try {
      await axios.delete(`${API}/delete-add-blogs/${id}`);
      fetchBlogs();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
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

        <input
          name="tags"
          placeholder="Tags (comma-separated)"
          value={form.tags}
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
                tags: "",
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
            <th>Tags</th>
            <th>Category</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog._id}>
              <td>{blog.title}</td>
              <td>{blog.slug}</td>
              <td>{blog.tags.join(", ")}</td>
              <td>
                {categories.find((cat) => cat._id === blog.category)?.name ||
                  "N/A"}
              </td>
              <td>{new Date(blog.createdAt).toLocaleString()}</td>
              <td>
                <button onClick={() => handleEdit(blog)}>Edit</button>
                <button onClick={() => handleDelete(blog._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AddBlogs;
