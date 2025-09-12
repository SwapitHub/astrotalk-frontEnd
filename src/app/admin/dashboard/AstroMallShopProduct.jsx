"use client";
import Loader from "@/app/component/Loader";
import SummernoteEditor from "@/app/component/SummernoteEditor";
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
  const [descriptionContent, setDescriptionContent] = useState("");
  const [shopId, setShopId] = useState();
  const [showImage, setShowImage] = useState();
  const [astrShopDetailData, setAstrShopDetailData] = useState("");


  useEffect(() => {
    if (!shopId) return;
    const fetchShopDetail = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}/get-astro-shope-detail/${shopId}`
        );
        console.log(res);

        const result = await res.json();
        setAstrShopDetailData(result.data);
      } catch (error) {
        console.error("Error fetching shop data:", error);
      }
    };

    fetchShopDetail();
  }, [shopId]);

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
    let meta_description = document.getElementById("meta_description").value;
    let meta_title = document.getElementById("meta_title").value;
    let meta_keywords = document.getElementById("meta_keywords").value;
    const image = document.getElementById("astroMallProductImg").files[0];
    const offer_name = document.getElementById("offer_name").value;
    const top_selling = document.getElementById("top_selling").checked;
    const newlyLaunched = document.getElementById("newlyLaunched").checked;
    const images = document.getElementById("astroMallImages").files;
    const selectedProductTypeId = document.querySelector(
      'input[name="product_type"]:checked'
    )?.id;
    console.log(selectedProductTypeId, "selectedProductTypeId");

    const starting_price =
      document.getElementById("Starting_price")?.value || "";
    const actual_price = document.getElementById("actual_price")?.value || "";
    const discount_price =
      document.getElementById("discount_price")?.value || "";
    setShopId(shop_id);

    if (!slug && name) {
      slug = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
    }

    if (
      !image ||
      !offer_name ||
      !name ||
      !slug ||
      !shop_id ||
      !selectedProductTypeId ||
      !meta_description ||
      !meta_title ||
      !meta_keywords
    ) {
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
    data.append("description", descriptionContent);
    data.append("top_selling", top_selling);
    data.append("newlyLaunched", newlyLaunched);
    data.append("detail_information", content);
    data.append("shop_product_type", selectedProductTypeId);
    data.append("shop_slug", astrShopDetailData?.slug);
    data.append("meta_description", meta_description);
    data.append("meta_title", meta_title);
    data.append("meta_keyword", meta_keywords);

    for (let i = 0; i < images.length; i++) {
      data.append("astroMallImages", images[i]);
    }
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
      document.getElementById("meta_description").value = "";
      document.getElementById("meta_title").value = "";
      document.getElementById("meta_keywords").value = "";
      document.getElementById("slug_product").value = "";
      document.getElementById("astroMallProductImg").value = "";
      document.getElementById("astroMallImages").value = "";
      document.getElementById("offer_name").value = "";
      document.getElementById("top_selling").checked = false;
      document.getElementById("newlyLaunched").checked = false;
      setContent("");
      setDescriptionContent("")
      const radios = document.querySelectorAll('input[name="product_type"]');
      radios.forEach((radio) => (radio.checked = false));

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
    document.getElementById("meta_description").value = product.meta_description;
    document.getElementById("meta_title").value = product.meta_title;
    document.getElementById("meta_keywords").value = product.meta_keyword;
    document.getElementById("slug_product").value = product.slug;
    document.getElementById("offer_name").value = product.offer_name;
    document.getElementById("shop_id").value = product.shop_id;
    document.getElementById("top_selling").checked = product.top_selling;
    document.getElementById("newlyLaunched").checked = product.newlyLaunched;

    setShowImage(product);

    setContent(product?.detail_information);
    setDescriptionContent(product?.description)

    const selectedRadio = document.querySelector(`input[name="product_type"][id="${product.shop_product_type}"]`);
    if (selectedRadio) {
      selectedRadio.checked = true;  // Select the corresponding radio button
    }

    // First determine discount or not
    const isDiscountProduct = !!(
      product.actual_price && product.discount_price
    );
    setShopListSingleData(isDiscountProduct);
    setShopId(product.shop_id);

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
    const meta_description = document.getElementById("meta_description").value;
    const meta_title = document.getElementById("meta_title").value;
    const meta_keywords = document.getElementById("meta_keywords").value;
    const slug = document.getElementById("slug_product").value;
    const shop_id = document.getElementById("shop_id").value;
    const image = document.getElementById("astroMallProductImg").files[0];
    const offer_name = document.getElementById("offer_name").value;
    const top_selling = document.getElementById("top_selling").checked;
    const newlyLaunched = document.getElementById("newlyLaunched").checked;
    const images = document.getElementById("astroMallImages").files;

    const starting_price =
      document.getElementById("Starting_price")?.value || "";
    const actual_price = document.getElementById("actual_price")?.value || "";
    const discount_price =
      document.getElementById("discount_price")?.value || "";
    setShopId(shop_id);
    const selectedProductTypeId = document.querySelector(
      'input[name="product_type"]:checked'
    )?.id;


    const data = new FormData();
    data.append("name", name);
    data.append("meta_description", meta_description);
    data.append("meta_title", meta_title);
    data.append("meta_keyword", meta_keywords);
    data.append("slug", slug);
    data.append("shop_id", shop_id);
    data.append("offer_name", offer_name);
    data.append("description", descriptionContent);
    data.append("top_selling", top_selling);
    data.append("newlyLaunched", newlyLaunched);
    data.append("detail_information", content);
    data.append("shop_product_type", selectedProductTypeId);
    data.append("shop_slug", astrShopDetailData?.slug);
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        data.append("astroMallImages", images[i]);
      }
    }
    if (image) data.append("astroMallProductImg", image);
    if (images) data.append("astroMallImages", images);
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
        document.getElementById("meta_description").value = "";
        document.getElementById("meta_title").value = "";
        document.getElementById("meta_keywords").value = "";
        document.getElementById("slug_product").value = "";
        document.getElementById("shop_id").value = "";
        document.getElementById("astroMallProductImg").value = "";
        document.getElementById("astroMallImages").value = "";
        document.getElementById("offer_name").value = "";
        document.getElementById("top_selling").checked = false;
        document.getElementById("newlyLaunched").checked = false;
        setShowImage("");
        setContent("");
        setDescriptionContent("");

        const radios = document.querySelectorAll('input[name="product_type"]');
        radios.forEach((radio) => (radio.checked = false));

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

  const deleteProductImgInner = async (deleteId, showImage) => {
    try {
      setLoading(true);

      // Delete image from backend & Cloudinary
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/delete-astro-product-single-image/${deleteId}`
      );

      if (response.status === 200) {
        toast.success("Image deleted", { position: "top-right" });

        // Filter out the deleted image from current showImage.images
        const updatedImages = showImage.images.filter(
          (img) => img._id !== deleteId
        );

        // Update showImage state
        setShowImage({ ...showImage, images: updatedImages });
      }
    } catch (err) {
      console.error("Delete API error", err);
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
            name="astroMallProductImg"
            accept="image/*"
            className="common-input-filed"
          />
          {showImage && (
            <div className="banner-img">
              <img src={showImage?.astroMallProductImg} alt="banner img" />
            </div>
          )}
        </div>
        <div className="form-field">
          <div className="label-content">
            <label>Upload multiple images</label>
          </div>
          <input
            type="file"
            id="astroMallImages"
            name="astroMallImages"
            accept="image/*"
            multiple
            className="common-input-filed"
          />

          {showImage?.images?.length > 0 && (
            <div className="tabbing-img">
              {showImage?.images.map((item) => (
                <div className="tab-img">
                  <span
                    onClick={() => deleteProductImgInner(item?._id, showImage)}
                  >
                    <RiDeleteBin7Fill />
                  </span>
                  <img src={item?.url} />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="form-field">
          <div className="label-content">
            <label>Please choose a shop</label>
          </div>
          <select
            className="common-input-filed"
            value={shopId || ''}
            id="shop_id"
            onChange={(e) => {
              const selectedShop = shopListData.find(
                (item) => item._id === e.target.value
              );
              setShopListSingleData(selectedShop?.discount_product || false);
              setShopId(e.target.value);
            }}
          >
            <option value="">-- Select Shop --</option>
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
              onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "e") {
                    e.preventDefault();
                  }
                }}
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
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "e") {
                    e.preventDefault();
                  }
                }}
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
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "e") {
                    e.preventDefault();
                  }
                }}
              />
            </div>
          </div>
        )}
        <div className="product-type-main form-field">
          <div className="label-content">
            <label>Product Type</label>
          </div>
          <div className="man-input-filed-sec">
            <div className="inner-radio">
              <input
                type="radio"
                id="astrologer_puja"
                name="product_type"
                className="common-input-filed"
              />
              <label>Astrologer Puja</label>
            </div>
            <div className="inner-radio">
              <input
                type="radio"
                id="gemstone_product"
                name="product_type"
                className="common-input-filed"
              />
              <label>Gemstone Product</label>
            </div>
            <div className="inner-radio">
              <input
                type="radio"
                id="another_product"
                name="product_type"
                className="common-input-filed"
              />
              <label>Another Product</label>
            </div>
          </div>
        </div>

        <div className="form-field">
          <div className="remove-astrict label-content">
            <label>Description</label>
          </div>
          <SummernoteEditor value={descriptionContent} onChange={setDescriptionContent} />

        </div>
        <div className="product-detail form-field">
          <div className="remove-astrict label-content">
            <label>Product Detail</label>
          </div>
          <SummernoteEditor value={content} onChange={setContent} />
        </div>

        <div className="form-field man-input-filed-sec">
          <label className="remove-astrict label-content top-selling field-checkbox">
            <input type="checkbox" id="top_selling" />
            <span>Can you move this product to the Top Selling group?</span>
          </label>
        </div>
        <div className="form-field man-input-filed-sec">
          <label className="remove-astrict label-content top-selling field-checkbox">
            <input type="checkbox" id="newlyLaunched" />
            <span>Can you move this product to the Top NEWLY LAUNCHED?</span>
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
