import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";

const NewlyLaunceSlider = ({NewlyLaunchedSlider}) => {
  const sliderSettings = {
    dots: false,
     infinite: NewlyLaunchedSlider?.length > 1,
    speed: 700,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 2000,
  };


  
  return (
    <section className="astromall-slider-outer">
      <div className="container">
        <div className="astromall-slider-inner">
          <div className="heading-sec">
            <h2>Newly Launched</h2>
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
              {NewlyLaunchedSlider?.map((item, index) => (
                <div className="single-slide" key={index}>
                  {console.log(item)
                  }
                  <Link href={`/shop/${item?.shop_slug}/${item.slug}/${item?.shop_product_type=="gemstone_product"?`?gemstone=true`:""}`}>
                    <div className="slide-img">
                      <Image
                        width={100}
                        height={100}
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

export default NewlyLaunceSlider;
