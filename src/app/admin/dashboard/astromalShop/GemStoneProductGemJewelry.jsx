"use client";
import DeletePopUp from "@/app/component/DeletePopUp";
import Loader from "@/app/component/Loader";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaEdit, FaSearch } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { RiDeleteBin7Fill } from "react-icons/ri";
import { toast } from "react-toastify";

const GemStoneProductGemJewelry = () => {
  let showNameData = "GemStone Jewelry";

  const [loading, setLoading] = useState(false);
  const [shopListData, setShopListData] = useState([]);
  const [productListData, setProductListData] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [shopListSingleData, setShopListSingleData] = useState(false);
  const [message, setMessage] = useState("");
  const [toggleAstroCategory, setToggleAstroCategory] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deletePermanently, setDeletePermanently] = useState(false);
  const [astroToDelete, setAstroToDelete] = useState();

  const fetchProductList = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/get-astro-gemstone-jewelry`
      );
      setProductListData(res.data.data);
    } catch (error) {
      toast.error("Product data not found", { position: "top-right" });
    }
  };

  const fetchShopList = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/get-astro-shope-list`
      );
      setShopListData(res.data.data);
    } catch (error) {
      toast.error("Shop data not found", { position: "top-right" });
    }
  };

  useEffect(() => {
    fetchProductList();
    fetchShopList();
  }, []);

  const handleSubmit = async () => {
    const name = document.getElementById("gem_name").value;
    const image = document.getElementById("astroGemstoneJewelryImg").files[0];
    const gemPrice = document.getElementById("gem_price").value;
    const productType = document.querySelector(
      'input[name="product_type"]:checked'
    );

    if (!image || !name || !gemPrice || !productType) {
      return setMessage("All Fields Are Required !");
    }

    const data = new FormData();
    data.append("name", name);
    data.append("actual_price", gemPrice);
    data.append("astroGemstoneJewelryImg", image);
    data.append("productType", productType.value);

    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/post-astro-gemstone-jewelry`,
        data
      );
      if (res?.status == 201) {
        toast.success("Added Successfully", { position: "top-right" });
        fetchProductList();
        setMessage("");
        setToggleAstroCategory(false);
      }
      document.getElementById("gem_name").value = "";
      document.getElementById("astroGemstoneJewelryImg").value = "";
      document.getElementById("gem_price").value = "";
      document
        .querySelectorAll('input[name="product_type"]')
        .forEach((input) => (input.checked = false));
    } catch (err) {
      console.error("Error uploading:", err);
      toast.error("Upload Failed", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setToggleAstroCategory(true);

    setTimeout(() => {
      // Set input values
      document.getElementById("gem_name").value = product.name;
      document.getElementById("gem_price").value = product.actual_price;

      // Set radio button based on productType value
      if (product.productType) {
        const radioToCheck = document.querySelector(
          `input[name="product_type"][value="${product.productType}"]`
        );
        if (radioToCheck) {
          radioToCheck.checked = true;
        }
      }

      // Set edit state
      setEditMode(true);
      setEditProductId(product._id);
    }, 1000);
  };

  const handleUpdate = async () => {
    const gem_name = document.getElementById("gem_name").value;
    const gem_price = document.getElementById("gem_price").value;
    const image = document.getElementById("astroGemstoneJewelryImg").files[0];
    const productType = document.querySelector(
      'input[name="product_type"]:checked'
    );

    const data = new FormData();
    data.append("name", gem_name);
    data.append("actual_price", gem_price);
    data.append("productType", productType.value);
    if (image) data.append("astroGemstoneJewelryImg", image);

    try {
      setLoading(true);
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/update-astro-gemstone-jewelry/${editProductId}`,
        data
      );
      if (res.status === 200) {
        toast.success("Updated Successfully", { position: "top-right" });
        setEditMode(false);
        setEditProductId(null);
        setToggleAstroCategory(false);

        fetchProductList();
        document.getElementById("gem_name").value = "";
        document.getElementById("gem_price").value = "";
        document.getElementById("astroGemstoneJewelryImg").value = "";
        document
          .querySelectorAll('input[name="product_type"]')
          .forEach((input) => (input.checked = false));
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Update Failed", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (deleteId) => {
    try {
      setLoading(true);
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/delete-astro-gemstone-jewelry/${deleteId}`
      );
      if (response.status == 200) {
        fetchProductList();
        toast.success("Delete Successfully", { position: "top-right" });
      }
    } catch (err) {
      console.log("delete API error", err);
      toast.error("Delete Failed", { position: "top-right" });
    } finally {
      setLoading(false);
      setShowDelete(false);
      setDeletePermanently(false);
      setAstroToDelete();
    }
  };
  useEffect(() => {
    if (deletePermanently && astroToDelete) {
      handleDeleteProduct(astroToDelete);
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
                  id="astroGemstoneJewelryImg"
                  accept="image/*"
                  className="common-input-filed"
                />
              </div>

              <div className="form-field">
                <div className="label-content">
                  <label>Name</label>
                </div>
                <input class="common-input-filed" id="gem_name" type="text" />
              </div>

              <div className="form-field">
                <div className="label-content">
                  <label>Price</label>
                </div>
                <input
                  class="common-input-filed"
                  id="gem_price"
                  type="number"
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "e") {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
              <div class="form-field">
                <div class="label-content">
                  <label>Product Type</label>
                </div>
                <div class="man-input-filed-sec">
                  <div class="inner-radio">
                    <input
                      className="common-input-field"
                      type="radio"
                      name="product_type"
                      value="Ring"
                      id="gem_ring"
                    />
                    <label>Ring</label>
                  </div>
                  <div class="inner-radio">
                    <input
                      className="common-input-field"
                      type="radio"
                      name="product_type"
                      value="Pendant"
                      id="gem_pendant"
                    />
                    <label>Pendant</label>
                  </div>
                </div>
              </div>

              {editMode ? (
                <button onClick={handleUpdate}>Update</button>
              ) : (
                <>
                  <button onClick={handleSubmit}>Submit</button>
                  <p className="error-msg">{message}</p>
                </>
              )}
            </div>
          </div>
        )}
        <div className="language-list">
          <h2> Shop gemstone product jewelry</h2>
          <div className="search-category-btn">
            <button
              onClick={() => {
                setToggleAstroCategory(true);
              }}
            >
              Add Astro gemstone Category
            </button>
          </div>
          {loading ? (
            <Loader />
          ) : (
            <div className="astromall-listing">
              {productListData.map((item, index) => {
                return (
                  <>
                    <div className="single-item" key={index}>
                      <div className="details-outer">
                        <div className="product-img">
                          <Image
                            width={100}
                            height={100}
                            src={
                              item?.astroGemstoneJewelryImg
                                ? process.env.NEXT_PUBLIC_WEBSITE_URL +
                                  item?.astroGemstoneJewelryImg
                                : "/user-icon-image.png"
                            }
                            alt="user-icon"
                          />
                        </div>

                        <div className="details-cont">
                          <div className="product-name">{item?.name}</div>
                          <p>Starting from ₹ {item?.actual_price}</p>
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
                              handleEditProduct(item);
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
        </div>
      </div>
    </>
  );
};

export default GemStoneProductGemJewelry;
