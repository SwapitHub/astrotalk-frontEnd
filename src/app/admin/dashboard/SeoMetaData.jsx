"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "@/app/component/Loader";
import { toast } from "react-toastify";
import DescriptionCell from "@/app/component/DescriptionCell";
import { MdDelete, MdEditSquare } from "react-icons/md";

const SeoMetaData = () => {
  const [message, setMessage] = useState("");
  const [seoList, setSeoList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 2; // Items per page

  const [form, setForm] = useState({
    _id: "", // Track id for update
    page: "",
    slug: "",
    meta_title: "",
    meta_description: "",
    keywords: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch SEO data with pagination
  const fetchSeoData = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/get-seo-meta-data?page=${page}&limit=${limit}`
      );
      setSeoList(res.data.data || []);
      setCurrentPage(res.data.pagination?.currentPage || 1);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (error) {
      toast.error("Failed to fetch SEO metadata");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeoData(currentPage);
  }, []);

  // Handle input change in form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Reset form fields and flags
  const resetForm = () => {
    setForm({
      _id: "",
      page: "",
      slug: "",
      meta_title: "",
      meta_description: "",
      keywords: "",
    });
    setIsUpdating(false);
  };

  // Add or update SEO metadata
  const handleSubmit = async () => {
    const { _id, page, slug, meta_title, meta_description, keywords } = form;

    if (!page || !slug || !meta_title || !meta_description || !keywords) {
      return setMessage("All Fields Are Required !");
    }

    try {
      if (isUpdating) {
        // Update existing metadata by _id
        const res = await axios.put(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}/put-seo-meta-data/${_id}`,
          { page, slug, meta_title, meta_description, keywords }
        );
        if (res.data.message === "success") {
          toast.success("SEO metadata updated successfully");
          resetForm();
          fetchSeoData(currentPage);
          setMessage("");
        }
      } else {
        // Add new metadata
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}/post-seo-meta-data`,
          { page, slug, meta_title, meta_description, keywords }
        );

        if (res.status == 200 || res.status == 201) {
          toast.success("SEO metadata added successfully");
          resetForm();
          fetchSeoData();
          setMessage("");
        } else {
          toast.error("Error submitting SEO metadata not get");
        }
      }
    } catch (error) {
      toast.error("Error submitting SEO metadata");
      console.error(error);
    }
  };

  // Load data into form for editing
  const handleEdit = (item) => {
    setForm({
      _id: item._id,
      page: item.page,
      slug: item.slug,
      meta_title: item.meta_title,
      meta_description: item.meta_description,
      keywords: item.keywords,
    });
    setIsUpdating(true);
  };

  // Delete SEO metadata by _id
  const handleDelete = async (_id) => {
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/delete-seo-meta-data/${_id}`
      );
      if (res.data.message === "success") {
        toast.success("SEO metadata deleted successfully");
        // If deleting last item on the current page, move back one page if possible
        if (seoList.length === 1 && currentPage > 1) {
          fetchSeoData(currentPage - 1);
        } else {
          fetchSeoData(currentPage);
        }
      }
    } catch (error) {
      toast.error("Failed to delete SEO metadata");
      console.error(error);
    }
  };

  return (
    <div className="seo-meta-data-manager">
      <h2>{isUpdating ? "Update SEO Metadata" : "Add New SEO Metadata"}</h2>

      <div className="admin-form-box">
        <div className="form-field">
          <div className="label-content">
            <label>Page</label>
          </div>
          <input
            type="text"
            name="page"
            value={form.page}
            onChange={handleChange}
            placeholder="Page name (e.g., Home)"
            className="common-input-filed"
          />
        </div>

        <div className="form-field">
          <div className="label-content">
            <label>Slug</label>
          </div>
          <input
            type="text"
            name="slug"
            value={form.slug}
            onChange={handleChange}
            placeholder="Unique slug (e.g., home)"
            className="common-input-filed"
          />
        </div>

        <div className="form-field">
          <div className="label-content">
            <label>Meta Title</label>
          </div>
          <input
            type="text"
            name="meta_title"
            value={form.meta_title}
            onChange={handleChange}
            placeholder="Meta title for SEO"
            className="common-input-filed"
          />
        </div>

        <div className="form-field">
          <div className="label-content">
            <label>Meta Description</label>
          </div>
          <textarea
            name="meta_description"
            value={form.meta_description}
            onChange={handleChange}
            placeholder="Meta description for SEO"
            className="common-input-filed"
            rows={3}
          />
        </div>

        <div className="form-field">
          <div className="label-content">
            <label>Keywords (comma separated)</label>
          </div>
          <input
            type="text"
            name="keywords"
            value={form.keywords}
            onChange={handleChange}
            placeholder="keywords, separated, by, commas"
            className="common-input-filed"
          />
        </div>

        <button onClick={handleSubmit} style={{ marginRight: "10px" }}>
          {isUpdating ? "Update SEO Metadata" : "Add SEO Metadata"}
        </button>
        <p className="error-msg">{message}</p>

        {isUpdating && (
          <button onClick={resetForm} type="button">
            Cancel
          </button>
        )}
      </div>

      <h2>Existing SEO Metadata</h2>

      {loading ? (
        <Loader />
      ) : seoList.length === 0 ? (
        <p>No SEO metadata found.</p>
      ) : (
        <>
          <div className="outer-table">
            <table
              className="seo-table"
              style={{ width: "100%", borderCollapse: "collapse" }}
            >
              <thead>
                <tr>
                  <th>
                    Page
                  </th>
                  <th >
                    Slug
                  </th>
                  <th >
                    Meta Title
                  </th>
                  <th>
                    Meta Description
                  </th>
                  <th>
                    Keywords
                  </th>
                  <th >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {seoList.map((item) => (
                  <tr key={item._id}>
                    <td >
                      {item.page}
                    </td>
                    <td>
                      {item.slug}
                    </td>
                    <td>
                      {item.meta_title}
                    </td>
                    <td>
                      <DescriptionCell
                        description={item.meta_description}
                        totalWord={20}
                      />
                    </td>
                    <td>
                      <DescriptionCell
                        description={item.keywords}
                        totalWord={10}
                      />
                    </td>
                    <td>
                      <div className="edit-delete-btn">
                      <button onClick={() => handleEdit(item)}><MdEditSquare /></button>
                      <button
                        onClick={() => handleDelete(item._id)}
                      >
                        <MdDelete />
                      </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 0 && (
            <div
              style={{
                marginTop: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <button
                onClick={() => fetchSeoData(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => fetchSeoData(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SeoMetaData;
