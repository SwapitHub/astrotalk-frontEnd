import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_WEBSITE_URL;

const AddBlogs = () => {
    const [form, setForm] = useState({
        title: '',
        slug: '',
        shortDescription: '',
        content: '',
        author: 'Admin',
        tags: '',
        coverImage: '',
        category: ''
    });

    const [blogs, setBlogs] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');

    // Fetch all blogs
    const fetchBlogs = async () => {
        try {
            const res = await axios.get(`${API}/get-add-blogs-all`);
            setBlogs(res.data);
        } catch (err) {
            console.error('Fetch blogs failed:', err);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    // Input handler
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.title || !form.content) {
            return setError('Title and content are required.');
        }

        try {
            if (editingId) {
                await axios.put(`${API}/put-add-blogs-update?id=${editingId}`, {
                    ...form,
                    tags: form.tags.split(',').map(tag => tag.trim())
                });
            } else {
                await axios.post(`${API}/post-add-blogs`, {
                    ...form,
                    tags: form.tags.split(',').map(tag => tag.trim())
                });
            }

            fetchBlogs();
            setForm({
                title: '',
                slug: '',
                shortDescription: '',
                content: '',
                author: 'Admin',
                tags: '',
                coverImage: '',
                category: ''
            });
            setEditingId(null);
            setError('');
        } catch (err) {
            console.error('Error submitting blog:', err);
            setError(err.response?.data?.error || 'Submission failed.');
        }
    };

    // Edit
    const handleEdit = (blog) => {
        setEditingId(blog._id);
        setForm({
            title: blog.title,
            slug: blog.slug,
            shortDescription: blog.shortDescription,
            content: blog.content,
            author: blog.author || 'Admin',
            tags: blog.tags.join(', '),
            coverImage: blog.coverImage,
            category: blog.category || ''
        });
    };

    // Delete
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure to delete this blog?')) return;
        try {
            await axios.delete(`${API}/delete-add-blogs?id=${id}`);
            fetchBlogs();
        } catch (err) {
            console.error('Delete failed:', err);
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>{editingId ? 'Edit Blog' : 'Add New Blog'}</h2>

            <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
                <input name="title" placeholder="Title" value={form.title} onChange={handleChange} /><br />
                <input name="slug" placeholder="Slug (optional)" value={form.slug} onChange={handleChange} /><br />
                <input name="shortDescription" placeholder="Short Description" value={form.shortDescription} onChange={handleChange} /><br />
                <textarea name="content" placeholder="Content" value={form.content} onChange={handleChange} rows={5} /><br />
                <input name="author" placeholder="Author" value={form.author} onChange={handleChange} /><br />
                <input name="tags" placeholder="Tags (comma-separated)" value={form.tags} onChange={handleChange} /><br />
                <input name="coverImage" placeholder="Cover Image URL" value={form.coverImage} onChange={handleChange} /><br />
                <input name="category" placeholder="Category ID" value={form.category} onChange={handleChange} /><br />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">{editingId ? 'Update' : 'Create'} Blog</button>
                {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ ...form, tags: '' }); }}>Cancel</button>}
            </form>

            <h2>All Blogs</h2>
            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Slug</th>
                        <th>Tags</th>
                        <th>Created</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {blogs.map(blog => (
                        <tr key={blog._id}>
                            <td>{blog.title}</td>
                            <td>{blog.slug}</td>
                            <td>{blog.tags.join(', ')}</td>
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
