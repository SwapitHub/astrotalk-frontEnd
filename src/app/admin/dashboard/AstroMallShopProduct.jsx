"use client";
import Loader from "@/app/component/Loader";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin7Fill } from "react-icons/ri";
import { toast } from "react-toastify";

const AstroMallShopProduct = () => {
  const [loading, setLoading] = useState(false);
  const [shopListData, setShopListData] = useState([]);
  const [productListData, setProductListData] = useState([]);
  const [astroShopId, setAstroShopId] = useState();
  console.log(astroShopId,"shop_id");
  
  useEffect(() => {
    const getAstroShopData = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}/get-astro-shope-list`
        );
        setShopListData(res.data.data);
        console.log(res, "res=================");
      } catch (error) {
        console.log("API error", error);
      }
    };

    getAstroShopData();
  }, []);


  useEffect(() => {
    const getAstroProductData = async () => {
      if (!astroShopId) return;

      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}/get-astro-shope-product-shop-id/${astroShopId}`
        );

        setProductListData(res.data.data);
      } catch (error) {
        toast.error("Data is not found ", {
          position: "top-right",
        });
        console.log("API error", error);
      }
    };

    getAstroProductData();
  }, [astroShopId]);

  const handleSubmit = async () => {
    const name = document.getElementById("name_product").value;
    let slug = document.getElementById("slug_product").value;
    let shop_id = document.getElementById("shop_id").value;
    const image = document.getElementById("astroMallProductImg").files[0];
    const offer_name = document.getElementById("offer_name").value;
    const description = document.getElementById("description").value;

    if (!slug && name) {
      slug = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "") // remove invalid chars
        .replace(/\s+/g, "-") // replace whitespace with -
        .replace(/-+/g, "-"); // remove duplicate hyphens
    }

    if (!image || !offer_name || !name || !slug || !shop_id) {
      toast.error("please fill all field", {
        position: "top-right",
      });
      return;
    }

    const data = new FormData();

    data.append("name", name);
    data.append("slug", slug);
    data.append("shop_id", shop_id);
    data.append("astroMallProductImg", image);
    data.append("offer_name", offer_name);
    data.append("description", description);

    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/post-astro-shope-product`,
        data
      );
      console.log(res);

      if (res?.status == 201) {
        toast.success("Added list Successfully", {
          position: "top-right",
        });
      }

      // clear input fields
      document.getElementById("name_product").value = "";
      document.getElementById("slug_product").value = "";
      document.getElementById("astroMallProductImg").value = "";
      document.getElementById("offer_name").value = "";
      document.getElementById("description").value = "";
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
          <select id="shop_id" onChange={(e) => setAstroShopId(e.target.value)}>
            {shopListData?.map((item, index) => (
              <option key={item._id} value={item._id} onChange={()=>{setAstroShopId(item._id)}}>
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

        <div className="form-field">
          <div className="remove-astrict label-content">
            <label>Description</label>
          </div>
          <textarea id="description" className="common-input-filed" />
        </div>
        <button onClick={handleSubmit}>Submit</button>
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
                      <div className="details-cont">
                        <div className="product-name">{item?.offer_name}</div>
                        <p>{item?.description}</p>
                      </div>
                      <div className="astro-mall-btn">
                        <button>
                          <RiDeleteBin7Fill />
                        </button>
                        <button>
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
