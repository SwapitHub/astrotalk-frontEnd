"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import useDebounce from "../hook/useDebounce";

const API = process.env.NEXT_PUBLIC_WEBSITE_URL;

const AstrologyBlog = () => {
  const [categories, setCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    totalBlogs: 0,
  });

  //   const debouncedSearch = useDebounce(search, 500);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API}/get-all-category-blogs`);
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const fetchBlogs = async (page = 1, limit = 3) => {
    try {
      const params = {
        page,
        limit,
      };

      if (categoryFilter) params.category = categoryFilter;
      if (debouncedSearch) params.search = debouncedSearch;

      const res = await axios.get(`${API}/get-add-blogs-all`, { params });
      setBlogs(res.data.blogs);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

const debouncedSearch = useDebounce(search, 1000); // Search triggers 5 sec after typing

useEffect(() => {
  // Reset page when category or debounced search changes
  setPagination((prev) => ({ ...prev, currentPage: 1 }));
}, [categoryFilter, debouncedSearch]);

useEffect(() => {
  fetchBlogs(pagination.currentPage); // Called only after debounce
}, [pagination.currentPage, categoryFilter, debouncedSearch]);


  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: newPage }));
    }
  };

  return (
    <div className="container" style={{ padding: "2rem" }}>
      <div className="astrology-blog">
        {/* Categories Filter */}
        <div className="astrology-category" style={{ marginBottom: "1rem" }}>
          <strong>Filter by Category:</strong>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
            <div
              style={{
                padding: "0.5rem 1rem",
                cursor: "pointer",
                backgroundColor: categoryFilter === "" ? "#0070f3" : "#eee",
                color: categoryFilter === "" ? "white" : "black",
                borderRadius: "4px",
                userSelect: "none",
              }}
              onClick={() => {
                setCategoryFilter("");
                setPagination((prev) => ({ ...prev, currentPage: 1 }));
              }}
            >
              All Categories
            </div>
            {categories.map((item) => (
              <div
                key={item._id}
                style={{
                  padding: "0.5rem 1rem",
                  cursor: "pointer",
                  backgroundColor:
                    categoryFilter === item._id ? "#0070f3" : "#eee",
                  color: categoryFilter === item._id ? "white" : "black",
                  borderRadius: "4px",
                  userSelect: "none",
                }}
                onClick={() => {
                  setCategoryFilter(item._id);
                  setPagination((prev) => ({ ...prev, currentPage: 1 }));
                }}
              >
                {item.name}
              </div>
            ))}
          </div>
        </div>

        {/* Search Input */}
        <div className="search-blogs" style={{ marginBottom: "1rem" }}>
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPagination((prev) => ({ ...prev, currentPage: 1 }));
            }}
          />
        </div>

        {/* Blogs Table */}
        <div className="category-list">
          <h2>All Blogs</h2>
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <Link
                href={`/astrology-blog/${blog?.slug}`}
                key={blog._id}
                className="inner-list"
              >
                <img src={blog?.coverImage} alt="" />
                <p>{blog?.shortDescription}</p>
                <div className="name-date">
                  <p>{blog?.title}</p>
                  <p>{new Date(blog.createdAt).toLocaleString()}</p>
                </div>
              </Link>
            ))
          ) : (
            <p>Data not found</p>
          )}

          {/* Pagination Controls */}
          <div style={{ marginTop: "1rem", textAlign: "center" }}>
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrevPage}
              style={{ marginRight: "10px" }}
            >
              Previous
            </button>
            <span>
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage}
              style={{ marginLeft: "10px" }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AstrologyBlog;
