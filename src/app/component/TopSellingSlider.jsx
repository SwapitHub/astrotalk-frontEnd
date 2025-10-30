import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";

const TopSellingSlider = ({ topSellingSlider }) => {
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 700,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 2000,
  };

  // useEffect(() => {
  //   const handleTopSelling = async () => {
  //     try {
  //       const res = await axios.get(
  //         `${process.env.NEXT_PUBLIC_WEBSITE_URL}/get-astro-product-list-top-selling/top_selling`
  //       );
  //       setTopSellingListData(res.data.data);
  //     } catch (error) {
  //       console.log("API error", error);
  //     }
  //   };
  //   handleTopSelling();
  // }, []);
  return (
    <section className="astromall-slider-outer ">
      <div className="container">
        <div className="astromall-slider-inner">
          <div className="heading-sec">
            <h2>Top Selling</h2>
          </div>
          <div className="slider-sec top-selling-slider">
            <Slider
              {...sliderSettings}
              responsive={[
                {
                  breakpoint: 1198,
                  settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true,
                  },
                },
                {
                  breakpoint: 800,
                  settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                  },
                },
                {
                  breakpoint: 576,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                  },
                },
              ]}
            >
              {topSellingSlider?.map((item, index) => (
                <div className="single-slide" key={index}>
                  <Link
                    href={`/shop/${item?.shop_slug}/${item.slug}/${
                      item?.shop_product_type == "gemstone_product"
                        ? `?gemstone=true`
                        : ""
                    }`}
                  >
                    <div className="slide-img">
                      <Image
                        width={270}
                        height={230}
                        src={
                          item?.astroMallProductImg
                            ? process.env.NEXT_PUBLIC_WEBSITE_URL +
                              item?.astroMallProductImg
                            : "/user-icon-image.png"
                        }
                        alt="user-icon"
                      />
                    </div>
                    <div className="slide-content">
                      <p>{item?.name}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopSellingSlider;
