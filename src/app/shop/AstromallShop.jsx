"use client";
import Link from "next/link";
import { useState } from "react";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import NewlyLaunceSlider from "../component/NewlyLaunceSlider";
import SearchProductSuggestion from "../component/SearchProductSuggestion";
import TopSellingSlider from "../component/TopSellingSlider";
import Image from "next/image";

const AstromallShop = ({
  topSellingSlider,
  NewlyLaunchedSlider,
  shopListData,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <main>
      <section className="astromall-sec-outer">
        <div className="container">
          <div className="astromall-sec-inner">
            <div className="heading-box">
              <h1 className="common-h1-heading">Shop the Universe</h1>
              <p>
                Unlock the power of astrology with our handpicked products and
                services.
              </p>
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
                <SearchProductSuggestion searchTerm={searchTerm} />
              </div>

              <div className="astromall-listing">
                {shopListData.map((item, index) => {
                  return (
                    <div className="single-item" key={index}>
                      <Link href={`/shop/${item?.slug}`}>
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
                            <div className="product-name">
                              {item?.offer_name}
                            </div>
                            <p>{item?.description}</p>
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
      <TopSellingSlider topSellingSlider={topSellingSlider} />
      <NewlyLaunceSlider NewlyLaunchedSlider={NewlyLaunchedSlider} />
    </main>
  );
};

export default AstromallShop;
