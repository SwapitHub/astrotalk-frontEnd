import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_WEBSITE_URL}`;

const AddBlogsCategory = () => {
    const [form, setForm] = useState({
        name: "",
        slug: "",
        description: ""
    });

    const [categories, setCategories] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");

    // Fetch all categories
    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${API_URL}/get-all-categories`);
            setCategories(res.data);
        } catch (err) {
            console.error("Error fetching categories:", err.message);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const validate = () => {
        const errs = {};
        if (!form.name) errs.name = "Category name is required";
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            if (editingId) {
                await axios.put(`${API_URL}/update-category/${editingId}`, form);
                setMessage("Category updated successfully");
            } else {
                await axios.post(`${API_URL}/post-category-blogs`, form);
                setMessage("Category created successfully");
            }

            setForm({ name: "", slug: "", description: "" });
            setEditingId(null);
            fetchCategories();
        } catch (err) {
            setErrors({
                api: err?.response?.data?.error || "An error occurred"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (category) => {
        setForm({
            name: category.name,
            slug: category.slug,
            description: category.description || ""
        });
        setEditingId(category._id);
        setErrors({});
        setMessage("");
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;

        try {
            await axios.delete(`${API_URL}/delete-category/${id}`);
            setMessage("Category deleted");
            fetchCategories();
        } catch (err) {
            setErrors({ api: "Failed to delete category" });
        }
    };

    const handleCancelEdit = () => {
        setForm({ name: "", slug: "", description: "" });
        setEditingId(null);
        setMessage("");
    };

    return (
        <div className="container">
            <div className="blogs-category">
                <h1>Manage Blog Categories</h1>

                <form onSubmit={handleSubmit} className="form">
                    <h2>{editingId ? "Edit Category" : "Create New Category"}</h2>

                    {message && <p className="success">{message}</p>}
                    {errors.api && <p className="error">{errors.api}</p>}

                    <div className="form-group">
                        <label>Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                        />
                        {errors.name && <p className="error">{errors.name}</p>}
                    </div>

                    <div className="form-group">
                        <label>Slug (optional)</label>
                        <input
                            type="text"
                            name="slug"
                            value={form.slug}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Description (optional)</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" disabled={loading}>
                            {loading ? "Saving..." : editingId ? "Update" : "Create"}
                        </button>
                        {editingId && (
                            <button type="button" onClick={handleCancelEdit}>
                                Cancel
                            </button>
                        )}
                    </div>
                </form>

                <h2>All Categories</h2>
                <table className="category-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Slug</th>
                            <th>Description</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length === 0 ? (
                            <tr>
                                <td colSpan="5">No categories found.</td>
                            </tr>
                        ) : (
                            categories.map((cat) => (
                                <tr key={cat._id}>
                                    <td>{cat.name}</td>
                                    <td>{cat.slug}</td>
                                    <td>{cat.description}</td>
                                    <td>{new Date(cat.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <button onClick={() => handleEdit(cat)}>Edit</button>
                                        <button onClick={() => handleDelete(cat._id)} className="danger">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                <style jsx>{`
        .container {
          max-width: 800px;
          margin: auto;
          padding: 2rem;
        }
        .form {
          background: #f9f9f9;
          padding: 1.5rem;
          border: 1px solid #eee;
          border-radius: 8px;
          margin-bottom: 2rem;
        }
        .form-group {
          margin-bottom: 1rem;
        }
        label {
          font-weight: bold;
          display: block;
          margin-bottom: 0.4rem;
        }
        input, textarea {
          width: 100%;
          padding: 0.6rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }
        .form-actions button {
          padding: 0.6rem 1.2rem;
          border: none;
          border-radius: 4px;
          background: #0070f3;
          color: white;
        }
        .form-actions button:hover {
          background: #005bb5;
        }
        .form-actions .danger {
          background: #e00;
        }
        .form-actions .danger:hover {
          background: #c00;
        }
        .error {
          color: red;
          font-size: 0.85rem;
        }
        .success {
          color: green;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        table th, table td {
          padding: 0.8rem;
          border: 1px solid #ccc;
        }
        table th {
          background: #eee;
        }
      `}</style>
            </div>
        </div>
    );
};

export default AddBlogsCategory;
