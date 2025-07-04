"use client";
import Loader from "@/app/component/Loader";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin7Fill } from "react-icons/ri";
import { toast } from "react-toastify";

const AstroMallShops = () => {
  const [loading, setLoading] = useState(false);

  const [shopListData, setShopListData] = useState([]);

  useEffect(() => {
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
    getAstroShopData();
  }, []);

  const handleSubmit = async () => {
    const image = document.getElementById("astroMallImg").files[0];
    const offer_title = document.getElementById("offer_title").value;
    const offer_name = document.getElementById("offer_name").value;
    const description = document.getElementById("description").value;
    console.log(image);

    if (!image || !offer_title || !offer_name) {
      toast.error("please fill all field", {
        position: "top-right",
      });
      return;
    }

    const data = new FormData();

    data.append("astroMallImg", image);
    data.append("offer_title", offer_title);
    data.append("offer_name", offer_name);
    data.append("description", description);

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
      }

      // clear input fields
      document.getElementById("astroMallImg").value = "";
      document.getElementById("offer_title").value = "";
      document.getElementById("offer_name").value = "";
      document.getElementById("description").value = "";
    } catch (err) {
      console.error("Error uploading:", err);
      toast.error("Api Error ", {
        position: "top-right",
      });
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
          <div className="Description label-content">
            <label>Description</label>
          </div>
          <textarea id="description" className="common-input-filed" />
        </div>
        <button onClick={handleSubmit}>Submit</button>
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

export default AstroMallShops;
