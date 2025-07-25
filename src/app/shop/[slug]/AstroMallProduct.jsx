"use client";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import ShopIdGetGlobal from "./ShopIdGetGlobal";

const AstroMallProduct = () => {
  const [productListData, setProductListData] = useState([]);
  const [astrShopDetailData, setAstrShopDetailData] = useState([]);
  const params = useParams();
 

  useEffect(() => {
    const getAstroProductData = async () => {
      if (!astrShopDetailData._id) return;

      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}/get-astro-shope-product-shop-id/${astrShopDetailData._id}`
        );

        setProductListData(res.data.data);
      } catch (error) {
        console.log("API error", error);
      }
    };

    getAstroProductData();
  }, [astrShopDetailData?._id]);

  return (
    <main>
      <ShopIdGetGlobal
        astrShopDetailData={astrShopDetailData}
        setAstrShopDetailData={setAstrShopDetailData}
      />
      <section className="astromall-sec-outer">
        <div className="container">
          <div className="astromall-sec-inner">
            <div className="heading-box">
              <h1 className="common-h1-heading">{params.slug} product</h1>
              <p>product Best Online Astrology Products And Services</p>
            </div>
            <div className="astromall-wrapper">
              <div className="astromall-search">
                <input
                  type="search"
                  placeholder="Let's find what you're looking for..."
                />
                <button>
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    stroke-width="0"
                    viewBox="0 0 512 512"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path>
                  </svg>
                </button>
              </div>

              <div className="astromall-listing">
                {productListData.map((item, index) => {
                  return (
                    <div className="single-item" key={index}>
                      <Link
                        href={`/shop/${params.slug}/${item?.slug}${
                          astrShopDetailData.Jewelry_product_gem
                            ? `?gemstone=true`
                            : ""
                        }`}
                      >
                        <div className="sales-tag">
                          <span>Book Now</span>
                        </div>
                        <div className="details-outer">
                          <div className="product-img">
                            <img src={item?.astroMallProductImg} alt="" />
                          </div>
                          <div className="details-cont">
                            {item?.discount_price ? (
                              <div className="details-cont">
                                <div className="product-name">
                                  {item?.offer_name}
                                </div>
                                <p>
                                  {" "}
                                  ₹ {item?.discount_price}{" "}
                                  {item?.actual_price!=0 &&
                                  
                                   <span className="old-amount">₹ {item?.actual_price}</span>
                                  }
                                </p>
                              </div>
                            ) : (
                              <div className="details-cont">
                                <div className="product-name">
                                  {item?.offer_name}
                                </div>
                                <p>Starting from ₹ {item?.starting_price}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
   
    </main>
  );
};

export default AstroMallProduct;
