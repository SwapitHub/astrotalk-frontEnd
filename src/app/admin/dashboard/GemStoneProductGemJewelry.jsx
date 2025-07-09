"use client";
import Loader from "@/app/component/Loader";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin7Fill } from "react-icons/ri";
import { toast } from "react-toastify";

const GemStoneProductGemJewelry = () => {
  const [loading, setLoading] = useState(false);
  const [shopListData, setShopListData] = useState([]);
  const [productListData, setProductListData] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [shopListSingleData, setShopListSingleData] = useState(false);

  console.log(shopListSingleData, "shopListSingleData");

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

    if (!image || !name || !gemPrice) {
      toast.error("Please fill all fields", { position: "top-right" });
      return;
    }

    const data = new FormData();
    data.append("name", name);
    data.append("actual_price", gemPrice);
    data.append("astroGemstoneJewelryImg", image);

    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/post-astro-gemstone-jewelry`,
        data
      );
      if (res?.status == 201) {
        toast.success("Added Successfully", { position: "top-right" });
        fetchProductList();
      }
      document.getElementById("gem_name").value = "";
      document.getElementById("astroGemstoneJewelryImg").value = "";
      document.getElementById("gem_price").value = "";
    } catch (err) {
      console.error("Error uploading:", err);
      toast.error("Upload Failed", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    document.getElementById("gem_name").value = product.name;
    document.getElementById("gem_price").value = product.actual_price;

    setEditMode(true);
    setEditProductId(product._id);
  };

  const handleUpdate = async () => {
    const gem_name = document.getElementById("gem_name").value;
    const gem_price = document.getElementById("gem_price").value;
    const image = document.getElementById("astroGemstoneJewelryImg").files[0];

    const data = new FormData();
    data.append("name", gem_name);
    data.append("actual_price", gem_price);
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
        fetchProductList();
        document.getElementById("gem_name").value = "";
        document.getElementById("gem_price").value = "";
        document.getElementById("astroGemstoneJewelryImg").value = "";
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
      if (response.status == 200) fetchProductList();
    } catch (err) {
      console.log("delete API error", err);
      toast.error("Delete Failed", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="AddLanguage AstroMallShops-admin">
      <div className="change-password">
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
          <input class="common-input-filed" id="gem_price" type="number" />
        </div>

        {editMode ? (
          <button onClick={handleUpdate}>Update</button>
        ) : (
          <button onClick={handleSubmit}>Submit</button>
        )}
      </div>
      <div className="language-list">
        <h2>Show astro mall producte list</h2>
        {loading ? (
          <Loader />
        ) : (
          <div className="astromall-listing">
            {productListData.map((item, index) => {
                console.log(item);
                
              return (
                <>
                  <div className="single-item" key={index}>
                   
                    <div className="details-outer">
                      <div className="product-img">
                        <img src={item?.astroGemstoneJewelryImg} alt="" />
                      </div>
                      
                        <div className="details-cont">
                          <div className="product-name">{item?.name}</div>
                          <p>Starting from ₹ {item?.actual_price}</p>
                        </div>
                    

                      <div className="astro-mall-btn">
                        <button
                          onClick={() => {
                            handleDeleteProduct(item._id);
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
  );
};

export default GemStoneProductGemJewelry;
