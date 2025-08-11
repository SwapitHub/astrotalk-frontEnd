"use client";
import Loader from "@/app/component/Loader";
import TextEditor from "@/app/component/TextEditor";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin7Fill } from "react-icons/ri";
import { toast } from "react-toastify";

const AstroMallShops = () => {
  const [loading, setLoading] = useState(false);
  const [shopListData, setShopListData] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editShopId, setEditShopId] = useState(null);
  const [shopContent, setShopContent] = useState("");

  const getAstroShopData = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/get-astro-shope-list`
      );
      setShopListData(res.data.data);
    } catch (error) {
      console.log("API error", error);
    }
  };

  useEffect(() => {
    getAstroShopData();
  }, []);

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
        getAstroShopData();
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

        await getAstroShopData(); // refresh list

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
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Update Failed", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteShop = async (deleteId) => {
    try {
      setLoading(true);
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/delete-astro-shope/${deleteId}`
      );
      if (response.status == 200) {
        getAstroShopData();
      }
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
          <input class="common-input-filed" id="offer_title" type="text" />
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
          <TextEditor value={shopContent} onChange={setShopContent} />
        </div>
        <div className="form-field">
          <div className="remove-astrict label-content field-checkbox">
            <input id="offer_checkbox" type="checkbox" />
            <label>Do you want to offer discounts on items in your shop?</label>
          </div>
        </div>

        <div className="form-field">
          <div className="remove-astrict label-content field-checkbox">
            <input id="Jewelry_product_gem" type="checkbox" />
            <label>
              Are you adding a Spiritual Jewelry Product in the "Gemstone"
              category?
            </label>
          </div>
        </div>
        {editMode ? (
          <button onClick={handleUpdateShop}>Update</button>
        ) : (
          <button onClick={handleSubmit}>Submit</button>
        )}
      </div>
      <div className="language-list">
        <h2>Show astro mall shope list</h2>
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
                        <img src={item?.astroMallImg} alt="" />
                      </div>
                      <div className="details-cont">
                        <div className="product-name">{item?.offer_name}</div>
                        <p>{item?.description}</p>
                      </div>
                      <div className="astro-mall-btn">
                        <button
                          onClick={() => {
                            handleDeleteShop(item?._id);
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
      </div>
    </div>
  );
};

export default AstroMallShops;
