"use client";
import Loader from "@/app/component/Loader";
import TextEditor from "@/app/component/TextEditor";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin7Fill } from "react-icons/ri";
import { toast } from "react-toastify";

const AstroMallShopProduct = () => {
  const [loading, setLoading] = useState(false);
  const [shopListData, setShopListData] = useState([]);
  const [productListData, setProductListData] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [shopListSingleData, setShopListSingleData] = useState(false);
  const [content, setContent] = useState("");

  console.log(shopListSingleData, "shopListSingleData");

  const fetchProductList = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/get-astro-shope-product`
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
    const name = document.getElementById("name_product").value;
    let slug = document.getElementById("slug_product").value;
    let shop_id = document.getElementById("shop_id").value;
    const image = document.getElementById("astroMallProductImg").files[0];
    const offer_name = document.getElementById("offer_name").value;
    const description = document.getElementById("description").value;
    const top_selling = document.getElementById("top_selling").checked;
    const newlyLaunched = document.getElementById("newlyLaunched").checked;


    const starting_price =
      document.getElementById("Starting_price")?.value || "";
    const actual_price = document.getElementById("actual_price")?.value || "";
    const discount_price =
      document.getElementById("discount_price")?.value || "";

    if (!slug && name) {
      slug = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
    }

    if (!image || !offer_name || !name || !slug || !shop_id) {
      toast.error("Please fill all fields", { position: "top-right" });
      return;
    }

    if (shopListSingleData && (!actual_price || !discount_price)) {
      toast.error("Please fill both actual and discount price", {
        position: "top-right",
      });
      return;
    }
    if (!shopListSingleData && !starting_price) {
      toast.error("Please enter starting price", { position: "top-right" });
      return;
    }

    const data = new FormData();
    data.append("name", name);
    data.append("slug", slug);
    data.append("shop_id", shop_id);
    data.append("astroMallProductImg", image);
    data.append("offer_name", offer_name);
    data.append("description", description);
    data.append("top_selling", top_selling);
    data.append("newlyLaunched", newlyLaunched);
    data.append("detail_information", content);

    if (shopListSingleData) {
      data.append("actual_price", actual_price);
      data.append("discount_price", discount_price);
    } else {
      data.append("starting_price", starting_price);
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/post-astro-shope-product`,
        data
      );
      if (res?.status == 201) {
        toast.success("Added Successfully", { position: "top-right" });
        fetchProductList();
      }
      document.getElementById("name_product").value = "";
      document.getElementById("slug_product").value = "";
      document.getElementById("astroMallProductImg").value = "";
      document.getElementById("offer_name").value = "";
      document.getElementById("description").value = "";
      document.getElementById("top_selling").checked = false;
      document.getElementById("newlyLaunched").checked = false;
      setContent("")

      let startingPrice = document.getElementById("Starting_price");
      if (startingPrice) startingPrice.value = "";

      let actualPrice = document.getElementById("actual_price");
      if (actualPrice) actualPrice.value = "";

      let discountPrice = document.getElementById("discount_price");
      if (discountPrice) discountPrice.value = "";
    } catch (err) {
      console.error("Error uploading:", err);
      toast.error("Upload Failed", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    document.getElementById("name_product").value = product.name;
    document.getElementById("slug_product").value = product.slug;
    document.getElementById("offer_name").value = product.offer_name;
    document.getElementById("shop_id").value = product.shop_id;
    document.getElementById("description").value = product.description;
    document.getElementById("top_selling").checked = product.top_selling;
    document.getElementById("newlyLaunched").checked = product.newlyLaunched;
  setContent(product?.detail_information)
    // First determine discount or not
    const isDiscountProduct = !!(
      product.actual_price && product.discount_price
    );
    setShopListSingleData(isDiscountProduct);

    // Delay price setting so that inputs get mounted
    setTimeout(() => {
      const startingPriceInput = document.getElementById("Starting_price");
      if (startingPriceInput)
        startingPriceInput.value = product.starting_price || "";

      const actualPriceInput = document.getElementById("actual_price");
      if (actualPriceInput) actualPriceInput.value = product.actual_price || "";

      const discountPriceInput = document.getElementById("discount_price");
      if (discountPriceInput)
        discountPriceInput.value = product.discount_price || "";
    }, 0); // next tick after render

    setEditMode(true);
    setEditProductId(product._id);
  };

  const handleUpdate = async () => {
    const name = document.getElementById("name_product").value;
    const slug = document.getElementById("slug_product").value;
    const shop_id = document.getElementById("shop_id").value;
    const image = document.getElementById("astroMallProductImg").files[0];
    const offer_name = document.getElementById("offer_name").value;
    const description = document.getElementById("description").value;
    const top_selling = document.getElementById("top_selling").checked;
    const newlyLaunched = document.getElementById("newlyLaunched").checked;

    const starting_price =
      document.getElementById("Starting_price")?.value || "";
    const actual_price = document.getElementById("actual_price")?.value || "";
    const discount_price =
      document.getElementById("discount_price")?.value || "";

    const data = new FormData();
    data.append("name", name);
    data.append("slug", slug);
    data.append("shop_id", shop_id);
    data.append("offer_name", offer_name);
    data.append("description", description);
    data.append("top_selling", top_selling);
    data.append("newlyLaunched", newlyLaunched);
    data.append("detail_information", content);

    if (image) data.append("astroMallProductImg", image);
    if (shopListSingleData) {
      data.append("actual_price", actual_price);
      data.append("discount_price", discount_price);
    } else {
      data.append("starting_price", starting_price);
    }

    try {
      setLoading(true);
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/update-astro-shope-product/${editProductId}`,
        data
      );
      if (res.status === 200) {
        toast.success("Updated Successfully", { position: "top-right" });
        setEditMode(false);
        setEditProductId(null);
        fetchProductList();
        document.getElementById("name_product").value = "";
        document.getElementById("slug_product").value = "";
        document.getElementById("shop_id").value = "";
        document.getElementById("astroMallProductImg").value = "";
        document.getElementById("offer_name").value = "";
        document.getElementById("description").value = "";
        document.getElementById("top_selling").checked = false;
        document.getElementById("newlyLaunched").checked = false;
        setContent("")
        let startingPrice = document.getElementById("Starting_price");
        if (startingPrice) startingPrice.value = "";

        let actualPrice = document.getElementById("actual_price");
        if (actualPrice) actualPrice.value = "";

        let discountPrice = document.getElementById("discount_price");
        if (discountPrice) discountPrice.value = "";
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
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/delete-astro-shope-product/${deleteId}`
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
            id="astroMallProductImg"
            accept="image/*"
            className="common-input-filed"
          />
        </div>

        <div className="form-field">
          <div className="label-content">
            <label>Please choose a shop</label>
          </div>
          <select
            className="common-input-filed"
            id="shop_id"
            onChange={(e) => {
              const selectedShop = shopListData.find(
                (item) => item._id === e.target.value
              );
              setShopListSingleData(selectedShop?.discount_product || false);
            }}
          >
            {shopListData?.map((item, index) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <div className="label-content">
            <label>Name</label>
          </div>
          <input class="common-input-filed" id="name_product" type="text" />
        </div>
        <div className="form-field">
          <div className="label-content remove-astrict">
            <label>Slug</label>
          </div>
          <input class="common-input-filed" id="slug_product" type="text" />
        </div>

        <div className="form-field">
          <div className="label-content">
            <label>Offer name</label>
          </div>
          <input id="offer_name" class="common-input-filed" type="text" />
        </div>
        {!shopListSingleData ? (
          <div className="form-field">
            <div className="label-content">
              <label>Starting Price</label>
            </div>
            <input
              type="number"
              id="Starting_price"
              className="common-input-filed"
            />
          </div>
        ) : (
          <div className="form-field">
            <div className="actual-price">
              <div className="label-content">
                <label>Actual Price</label>
              </div>
              <input
                type="number"
                id="actual_price"
                className="common-input-filed"
              />
            </div>
            <div className="discount-price">
              <div className="label-content">
                <label>Discount Price</label>
              </div>
              <input
                type="number"
                id="discount_price"
                className="common-input-filed"
              />
            </div>
          </div>
        )}
        
        <div className="form-field">
          <div className="remove-astrict label-content">
            <label>Description</label>
          </div>
          <textarea id="description" className="common-input-filed" />
        </div>
        <TextEditor setContent={setContent} content={content}/>

        <div className="form-field">
          <div className="remove-astrict label-content top-selling field-checkbox">
            <input type="checkbox" id="top_selling"/>
            <label>Can you move this product to the Top Selling group?</label>
          </div>
        </div>
        <div className="form-field">
          <div className="remove-astrict label-content top-selling field-checkbox">
            <input type="checkbox" id="newlyLaunched"/>
            <label>Can you move this product to the Top NEWLY LAUNCHED?</label>
          </div>
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
              return (
                <>
                  <div className="single-item" key={index}>
                    <div className="sales-tag">
                      <span>Book Now</span>
                    </div>
                    <div className="details-outer">
                      <div className="product-img">
                        <img src={item?.astroMallProductImg} alt="" />
                      </div>
                      {item?.discount_price ? (
                        <div className="details-cont">
                          <div className="product-name">{item?.offer_name}</div>
                          <p>
                            {" "}
                            ₹ {item?.discount_price}{" "}
                            <span className="old-amount">
                              ₹ {item?.actual_price}
                            </span>
                          </p>
                        </div>
                      ) : (
                        <div className="details-cont">
                          <div className="product-name">{item?.offer_name}</div>
                          <p>Starting from ₹ {item?.starting_price}</p>
                        </div>
                      )}

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

export default AstroMallShopProduct;
