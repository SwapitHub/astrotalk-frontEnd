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
import { RiDeleteBin7Fill } from "react-icons/ri";
import { toast } from "react-toastify";

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
  const [limit, setLimit] = useState(4);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

    if (!image || !offer_title || !offer_name || !name || !slug) {
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
              {editMode ? (
                <button onClick={handleUpdateShop}>Update</button>
              ) : (
                <button onClick={handleSubmit}>Submit</button>
              )}
            </div>
          </div>
        )}
        <div className="language-list">
          <h2>Show astro mall shop list</h2>
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
            <div className="astromall-listing">
              {shopListData.map((item, index) => {
                return (
                  <>
                    <div className="single-item" key={index}>
                      <div className="sales-tag">
                        <span>{item?.offer_title}</span>
                      </div>
                      <div className="details-outer">
                        <div className="product-img">
                          <Image
                            width={100}
                            height={100}
                            src={
                              item?.astroMallImg
                                ? process.env.NEXT_PUBLIC_WEBSITE_URL +
                                  item?.astroMallImg
                                : "/user-icon-image.png"
                            }
                            alt="user-icon"
                          />
                        </div>
                        <div className="details-cont">
                          <div className="product-name">{item?.offer_name}</div>
                          <p>{item?.description}</p>
                        </div>

                        <div className="astro-mall-btn">
                          <button
                            onClick={() => {
                              setAstroToDelete(item._id);
                              setShowDelete(true);
                            }}
                          >
                            <RiDeleteBin7Fill />
                          </button>
                          <button
                            onClick={() => {
                              handleEditShop(item);
                            }}
                          >
                            <FaEdit />
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })}
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
