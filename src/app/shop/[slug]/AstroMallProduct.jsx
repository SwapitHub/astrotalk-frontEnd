"use client";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import he from "he";

const AstroMallProduct = ({astrShopDetailData}) => {
  const params = useParams();
  const [productListData, setProductListData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [decodedHtml, setDecodedHtml] = useState("");

  useEffect(() => {
    const getAstroProductData = async () => {
      if (!astrShopDetailData?._id) return;

      setLoading(true);

      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}/get-astro-shope-product-shop-id/${astrShopDetailData._id}`,
          {
            params: searchTerm ? { search: searchTerm } : {},
          }
        );

        setProductListData(res.data.data);
      } catch (error) {
        console.log("API error", error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce by 300ms
    const debounceTimer = setTimeout(() => {
      getAstroProductData();
    }, 400);

    return () => clearTimeout(debounceTimer);
  }, [astrShopDetailData?._id, searchTerm]);

  useEffect(() => {
    if (astrShopDetailData?.detail_shop_information) {
      const decoded = he.decode(astrShopDetailData?.detail_shop_information);

      const sanitizedHtml = DOMPurify.sanitize(decoded);

      setDecodedHtml(sanitizedHtml);
    }
  }, [astrShopDetailData]);

  return (
    <main>
    
      <section className="astromall-sec-outer">
        <div className="container">
          <div className="astromall-sec-inner">
            <div className="heading-box">
              <h1 className="common-h1-heading">{params.slug} product</h1>
              <p>Product Best Online Astrology Products And Services</p>
            </div>
            <div className="astromall-wrapper">
              <div className="astromall-search">
                <input
                  type="search"
                  placeholder="Let's find what you're looking for..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                          
                            {item?.discount_price ? (
                              <div className="details-cont">
                                <div className="product-name">
                                  {item?.offer_name}
                                </div>
                                <p>
                                  {" "}
                                  ₹ {item?.discount_price}{" "}
                                  {item?.actual_price != 0 && (
                                    <span className="old-amount">
                                      ₹ {item?.actual_price}
                                    </span>
                                  )}
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
                        
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
      {console.log(decodedHtml.length > 0)}
      {decodedHtml !== "<p>undefined</p>" &&
        decodedHtml !== "undefined" &&
        decodedHtml.trim().length > 0 && (
          <section className="product-faqs-outer">
            <div className="container">
              <div dangerouslySetInnerHTML={{ __html: decodedHtml }} />
            </div>
          </section>
        )}
    </main>
  );
};

export default AstroMallProduct;
