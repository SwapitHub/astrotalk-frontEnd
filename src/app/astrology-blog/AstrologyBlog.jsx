"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import useDebounce from "../hook/useDebounce";
import Loader from "../component/Loader";

const API = process.env.NEXT_PUBLIC_WEBSITE_URL;

const AstrologyBlog = () => {
  const [categories, setCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [search, setSearch] = useState("");
  const [loader, setLoader] = useState(false);
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
    setLoader(true);
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
    } finally {
      setLoader(false);
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
    <div className="astrology-blog">
      <div className="container">
        <div className="astrology-blog-inner">
          {/* Categories Filter */}
          <div className="astrology-category">
            <strong>Filter by Category:</strong>
            <div className="filter-tabs-outer">
              <div className={`filter-tab ${ categoryFilter === "" ? "" : "active"}`} onClick={() => {
                  setCategoryFilter("");
                  setPagination((prev) => ({ ...prev, currentPage: 1 }));
                }}
              >
                All Categories
              </div>
              {categories.map((item) => (
                <div
                  key={item._id}
                 className={`filter-tab ${ categoryFilter === "" ? "" : "active"}`}
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
             className="common-input-filed"
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
          <div className="posts-listing">

            {loader && <Loader />}

            {blogs.length > 0 ? (
              blogs.map((blog) => (
                <Link
                  href={`/astrology-blog/${blog?.slug}`}
                  key={blog._id}
                  className="inner-list"
                >
                  <div className="post-img">
                  <img src={blog?.coverImage} alt="" />
                  </div>
                  <div className="post-content">
                  <p>{blog?.shortDescription}</p>
                  <div className="name-date">
                    <p>{blog?.title}</p>
                    <p>{new Date(blog.createdAt).toLocaleString()}</p>
                  </div>
                  </div>
                </Link>
              ))
            ) : (
              <p>Data not found</p>
            )}

            {/* Pagination Controls */}
            <div className="pagination">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage}
              >
                Previous
              </button>
              <span>
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
              >
                Next
              </button>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AstrologyBlog;
