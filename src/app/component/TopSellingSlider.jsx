import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
import axios from "axios";

const TopSellingSlider = () => {
  const [topSellingListData, setTopSellingListData] = useState();
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 700,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 2000,
  };

  console.log(topSellingListData);

  useEffect(() => {
    const handleTopSelling = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}/get-astro-product-list-top-selling/top_selling`
        );
        setTopSellingListData(res.data.data);
      } catch (error) {
        console.log("API error", error);
      }
    };
    handleTopSelling();
  }, []);
  return (
    <section className="astromall-slider-outer">
      <div className="container">
        <div className="astromall-slider-inner">
          <div className="heading-sec">
            <h2>TOP SELLING</h2>
          </div>
          <div className="slider-sec top-selling-slider">
            <Slider
              {...sliderSettings}
              responsive={[
                {
                  breakpoint: 1198,
                  settings: {
                    slidesToShow: 3,
                    slidesToScroll: 4,
                    infinite: true,
                  },
                },
                {
                  breakpoint: 800,
                  settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                  },
                },
                {
                  breakpoint: 639,
                  settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                  },
                },
                {
                  breakpoint: 375,
                  settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    infinite: true,
                  },
                },
              ]}
            >
              {topSellingListData?.map((item, index) => (
                <div className="single-slide" key={index}>
                  <Link href={`/shop/${item.slug}`}>
                    <div className="slide-img">
                      <img src={item?.astroMallProductImg} alt="" />
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
