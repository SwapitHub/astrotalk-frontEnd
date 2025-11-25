"use client";
import DeletePopUp from "@/app/component/DeletePopUp";
import Loader from "@/app/component/Loader";
import SummernoteEditor from "@/app/component/SummernoteEditor";
import TextEditor from "@/app/component/TextEditor";
import useDebounce from "@/app/hook/useDebounce";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaEdit, FaSearch } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiDeleteBin7Fill } from "react-icons/ri";
import { toast } from "react-toastify";
import AstromallShopView from "./AstromallShopView";
import ShowLessShowMore from "@/app/component/ShowLessShowMore";

const AstroMallShops = () => {
  let showNameData = "Shop";

  const [shopListData, setShopListData] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editShopId, setEditShopId] = useState(null);
  const [shopContent, setShopContent] = useState("");
  const [toggleAstroCategory, setToggleAstroCategory] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deletePermanently, setDeletePermanently] = useState(false);
  const [astroToDelete, setAstroToDelete] = useState();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewProductData, setViewProductData] = useState();
  const [viewProductStatus, setViewProductStatus] = useState(false);
  const debouncedSearch = useDebounce(search, 1000);

  const fetchShopItems = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/get-astro-shope-list`,
        {
          params: {
            page,
            limit,
            search: debouncedSearch,
          },
        }
      );

      const { data, pagination } = response.data;
      setShopListData(data);
      setTotalPages(pagination.totalPages);
      setTotalCount(pagination.totalCount);
    } catch (err) {
      setError("Failed to fetch shop items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShopItems();
  }, [page, limit, debouncedSearch]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleSubmit = async () => {
    const name = document.getElementById("name_shop").value;
    let slug = document.getElementById("slug_shop").value;
    const image = document.getElementById("astroMallImg").files[0];
    const offer_title = document.getElementById("offer_title").value;
    const offer_name = document.getElementById("offer_name").value;
    const description = document.getElementById("description").value;
    let meta_description = document.getElementById("meta_description").value;
    let meta_title = document.getElementById("meta_title").value;
    let meta_keywords = document.getElementById("meta_keywords").value;
    const isDiscounted = document.getElementById("offer_checkbox").checked;
    const Jewelry_product = document.getElementById(
      "Jewelry_product_gem"
    ).checked;
    setShopContent("");

    if (!slug && name) {
      slug = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "") // remove invalid chars
        .replace(/\s+/g, "-") // replace whitespace with -
        .replace(/-+/g, "-"); // remove duplicate hyphens
    }

    if (
      !image ||
      !offer_title ||
      !offer_name ||
      !name ||
      !slug ||
      !meta_description ||
      !meta_title ||
      !meta_keywords
    ) {
      toast.error("please fill all field", {
        position: "top-right",
      });
      return;
    }

    const data = new FormData();

    data.append("name", name);
    data.append("slug", slug);
    data.append("astroMallImg", image);
    data.append("offer_title", offer_title);
    data.append("offer_name", offer_name);
    data.append("description", description);
    data.append("discount_product", isDiscounted);
    data.append("Jewelry_product_gem", Jewelry_product);
    data.append("detail_shop_information", shopContent);
    data.append("meta_description", meta_description);
    data.append("meta_title", meta_title);
    data.append("meta_keyword", meta_keywords);

    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/astro-shope-list`,
        data
      );
      console.log(res);

      if (res?.status == 201) {
        toast.success("Added list Successfully", {
          position: "top-right",
        });
        fetchShopItems();
        setToggleAstroCategory(false);
      }

      // clear input fields
      document.getElementById("name_shop").value = "";
      document.getElementById("slug_shop").value = "";
      document.getElementById("astroMallImg").value = "";
      document.getElementById("offer_title").value = "";
      document.getElementById("offer_name").value = "";
      document.getElementById("description").value = "";
      document.getElementById("meta_description").value = "";
      document.getElementById("meta_title").value = "";
      document.getElementById("meta_keywords").value = "";
      document.getElementById("offer_checkbox").checked = false;
      document.getElementById("Jewelry_product_gem").checked = false;
    } catch (err) {
      console.error("Error uploading:", err);
      if (
        err.response.data?.message ==
        "Slug already exists. Please choose a different one."
      ) {
        toast.error("Slug already exists. Please choose a different one.", {
          position: "top-right",
        });
      } else {
        toast.error("Api Error ", {
          position: "top-right",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditShop = (shop) => {
    setToggleAstroCategory(true);
    setTimeout(() => {
      document.getElementById("name_shop").value = shop.name;
      document.getElementById("slug_shop").value = shop.slug;
      document.getElementById("meta_description").value = shop.meta_description;
      document.getElementById("meta_title").value = shop.meta_title;
      document.getElementById("meta_keywords").value = shop.meta_keyword;
      document.getElementById("offer_title").value = shop.offer_title;
      document.getElementById("offer_name").value = shop.offer_name;
      document.getElementById("description").value = shop.description;
      document.getElementById("offer_checkbox").checked = shop.discount_product;
      document.getElementById("Jewelry_product_gem").checked =
        shop.Jewelry_product_gem;
      setShopContent(shop?.detail_shop_information);

      setEditMode(true);
      setEditShopId(shop._id);
    }, 1000);
  };

  const handleUpdateShop = async () => {
    const name = document.getElementById("name_shop").value;
    const slug = document.getElementById("slug_shop").value;
    const image = document.getElementById("astroMallImg").files[0];
    const offer_title = document.getElementById("offer_title").value;
    const offer_name = document.getElementById("offer_name").value;
    const description = document.getElementById("description").value;
    const isDiscounted = document.getElementById("offer_checkbox").checked;
    const meta_description = document.getElementById("meta_description").value;
    const meta_title = document.getElementById("meta_title").value;
    const meta_keywords = document.getElementById("meta_keywords").value;
    const Jewelry_product = document.getElementById(
      "Jewelry_product_gem"
    ).checked;

    const data = new FormData();
    data.append("name", name);
    data.append("slug", slug);
    data.append("offer_title", offer_title);
    data.append("offer_name", offer_name);
    data.append("description", description);
    data.append("discount_product", isDiscounted);
    data.append("Jewelry_product_gem", Jewelry_product);
    data.append("detail_shop_information", shopContent);
    data.append("meta_description", meta_description);
    data.append("meta_title", meta_title);
    data.append("meta_keyword", meta_keywords);

    if (image) {
      data.append("astroMallImg", image); // only append if new image is selected
    }

    try {
      setLoading(true);
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/update-astro-shope/${editShopId}`,
        data
      );

      if (res.status === 200) {
        toast.success("Updated Successfully", { position: "top-right" });
        setEditMode(false);
        setEditShopId(null);
        await fetchShopItems(); // refresh list
        // Clear inputs
        document.getElementById("name_shop").value = "";
        document.getElementById("slug_shop").value = "";
        document.getElementById("astroMallImg").value = "";
        document.getElementById("offer_title").value = "";
        document.getElementById("offer_name").value = "";
        document.getElementById("description").value = "";
        document.getElementById("meta_description").value = "";
        document.getElementById("meta_title").value = "";
        document.getElementById("meta_keywords").value = "";
        document.getElementById("offer_checkbox").checked = false;
        document.getElementById("Jewelry_product_gem").checked = false;
        setShopContent("");
        setToggleAstroCategory(false);
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Update Failed", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteShop = async (astroToDelete) => {
    try {
      setLoading(true);
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/delete-astro-shope/${astroToDelete}`
      );
      if (response.status == 200) {
        await fetchShopItems();
        toast.success("Removed successfully", { position: "top-right" });
      }
    } catch (err) {
      console.log("delete API error", err);
    } finally {
      setLoading(false);
      setShowDelete(false);
      setDeletePermanently(false);
      setAstroToDelete();
    }
  };

  useEffect(() => {
    if (deletePermanently && astroToDelete) {
      handleDeleteShop(astroToDelete);
    }
  }, [deletePermanently]);
  return (
    <>
      {showDelete && (
        <DeletePopUp
          setShowDelete={setShowDelete}
          setDeletePermanently={setDeletePermanently}
          showNameData={showNameData}
        />
      )}
      {viewProductStatus && (
        <AstromallShopView
          viewProductData={viewProductData}
          setViewProductStatus={setViewProductStatus}
        />
      )}
      <div className="AddLanguage AstroMallShops-admin">
        {toggleAstroCategory && (
          <div className="change-password-popup">
            <div className="change-password">
              <span
                className="close"
                onClick={() => setToggleAstroCategory(false)}
              >
                <IoClose />
              </span>
              <div className="form-field">
                <div className="label-content">
                  <label>Upload image</label>
                </div>
                <input
                  type="file"
                  id="astroMallImg"
                  accept="image/*"
                  className="common-input-filed"
                />
              </div>
              <div className="form-field">
                <div className="label-content">
                  <label>Name</label>
                </div>
                <input class="common-input-filed" id="name_shop" type="text" />
              </div>
              <div className="form-field">
                <div className="label-content remove-astrict">
                  <label>Slug</label>
                </div>
                <input class="common-input-filed" id="slug_shop" type="text" />
              </div>
              <div className="form-field">
                <div className="label-content">
                  <label>Offer title</label>
                </div>
                <input
                  class="common-input-filed"
                  id="offer_title"
                  type="text"
                />
              </div>
              <div className="form-field">
                <div className="label-content">
                  <label>Offer name</label>
                </div>
                <input id="offer_name" class="common-input-filed" type="text" />
              </div>

              <div className="form-field">
                <div className="remove-astrict label-content">
                  <label>Description</label>
                </div>
                <textarea id="description" className="common-input-filed" />
              </div>

              <div className="shop-detail form-field">
                <div className="label-content">
                  <label>Shop Detail</label>
                </div>

                <SummernoteEditor
                  value={shopContent}
                  onChange={setShopContent}
                />
              </div>
              <div className="form-field man-input-filed-sec">
                <label className="remove-astrict label-content field-checkbox">
                  <input id="offer_checkbox" type="checkbox" />
                  <span>
                    Do you want to offer discounts on items in your shop?
                  </span>
                </label>
              </div>

              <div className="form-field man-input-filed-sec">
                <label className="remove-astrict label-content field-checkbox">
                  <input id="Jewelry_product_gem" type="checkbox" />
                  <span>
                    Are you adding a Spiritual Jewelry Product in the "Gemstone"
                    category?
                  </span>
                </label>
              </div>

              <div className="form-field">
                <div className="label-content">
                  <label>Meta Title</label>
                </div>
                <input
                  type="text"
                  name="meta_title"
                  id="meta_title"
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
                  id="meta_description"
                  placeholder="Meta description for SEO"
                  className="common-input-filed"
                />
              </div>

              <div className="form-field">
                <div className="label-content">
                  <label>Keywords (comma separated)</label>
                </div>
                <input
                  type="text"
                  name="keywords"
                  id="meta_keywords"
                  placeholder="keywords, separated, by, commas"
                  className="common-input-filed"
                />
              </div>
              {editMode ? (
                <button onClick={handleUpdateShop}>Update</button>
              ) : (
                <button onClick={handleSubmit}>Submit</button>
              )}
            </div>
          </div>
        )}
        <div className="language-list">
          <h2>Show astro mall shop Total list - {totalCount}</h2>
          <div className="search-category-btn">
            <button
              onClick={() => {
                setToggleAstroCategory(true);
              }}
            >
              Add Astro Shop
            </button>
            <div className="search-box-top-btn">
              <div className="search-box-filed">
                <input
                  type="search"
                  placeholder="Search name..."
                  aria-label="Search wallet transactions"
                  value={search}
                  onChange={handleSearchChange}
                />
              </div>
              <div className="search-button-filed">
                <button type="button">
                  <FaSearch />
                </button>
              </div>
            </div>
          </div>
          {loading ? (
            <Loader />
          ) : (
            <div className="outer-table">
              <table
                border="1"
                cellPadding="8"
                style={{ marginBottom: "20px" }}
              >
                <thead>
                  <tr>
                    <th>Offer Name</th>
                    <th>Shop image</th>
                    <th>Offer Title</th>
                    <th>Description</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {shopListData?.length > 0 ? (
                    shopListData.map((item) => (
                      <tr key={item._id}>
                        <td>{item.offer_name}</td>
                        <td>
                          <Image
                            width={233}
                            height={233}
                            src={
                              item?.astroMallImg
                                ? process.env.NEXT_PUBLIC_WEBSITE_URL +
                                  item?.astroMallImg
                                : "/user-icon-image.png"
                            }
                            alt="user-icon"
                          />
                        </td>
                        <td>{item?.offer_title}</td>
                        <td>
                          <ShowLessShowMore
                            description={item.description}
                            totalWord={10}
                          />
                        </td>
                        <td>
                          <button
                            className="delete-btn"
                            onClick={() => {
                              setViewProductData(item);
                              setViewProductStatus(true);
                            }}
                          >
                            <MdOutlineRemoveRedEye />
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => {
                              handleEditShop(item);
                            }}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => {
                              setAstroToDelete(item._id);
                              setShowDelete(true);
                            }}
                          >
                            <RiDeleteBin7Fill />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center" }}>
                        No data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          <div className="pagination">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AstroMallShops;
