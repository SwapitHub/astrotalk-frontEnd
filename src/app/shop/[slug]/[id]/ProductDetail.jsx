"use client";
import axios from "axios";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const ProductDetail = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const gemstone = searchParams.get("gemstone");
  const [productDetailData, setProductDetailData] = useState();
  const [gemStoneJewelryData, setGemStoneJewelryData] = useState();
  console.log(gemstone);

  const handleProductDetail = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/get-astro-product-detail/${params?.id}`
      );

      setProductDetailData(response.data.data);
    } catch (err) {
      console.log("product detail data is not found", err);
    }
  };

  const handleGemStoneJewelry = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/get-astro-gemstone-jewelry`
      );
      setGemStoneJewelryData(response.data.data);
    } catch (err) {
      console.log("gemstone jewelry api err", err);
    }
  };

  useEffect(() => {
    handleProductDetail();
    handleGemStoneJewelry();
  }, []);

  return (
    <>
      <div className="breadcrumb-outer">
        <div className="container">
          <div className="breadcrumb">
            <ul>
              <li>
                <a href="/chat-with-astrologer">
                  <span className="icon">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      stroke-width="0"
                      viewBox="0 0 512 512"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M261.56 101.28a8 8 0 0 0-11.06 0L66.4 277.15a8 8 0 0 0-2.47 5.79L63.9 448a32 32 0 0 0 32 32H192a16 16 0 0 0 16-16V328a8 8 0 0 1 8-8h80a8 8 0 0 1 8 8v136a16 16 0 0 0 16 16h96.06a32 32 0 0 0 32-32V282.94a8 8 0 0 0-2.47-5.79z"></path>
                      <path d="m490.91 244.15-74.8-71.56V64a16 16 0 0 0-16-16h-48a16 16 0 0 0-16 16v32l-57.92-55.38C272.77 35.14 264.71 32 256 32c-8.68 0-16.72 3.14-22.14 8.63l-212.7 203.5c-6.22 6-7 15.87-1.34 22.37A16 16 0 0 0 43 267.56L250.5 69.28a8 8 0 0 1 11.06 0l207.52 198.28a16 16 0 0 0 22.59-.44c6.14-6.36 5.63-16.86-.76-22.97z"></path>
                    </svg>
                  </span>
                </a>
                <a href="#">Astromall</a>
                <a href="#">Gemstone</a>
                <span className="text">{productDetailData?.name}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <section className="products-details-outer">
        <div className="container">
          <div className="products-details-inner">
            <div className="product-images-left"></div>
            <div className="product-details-right">
              <div className="product-right-desc">
                <h1>{productDetailData?.name}</h1>
                <p>{productDetailData?.description}</p>
              </div>
              {productDetailData?.starting_price ? (
                <div className="product-price">
                  <span className="new-amount">
                    ₹ {productDetailData?.starting_price}
                  </span>
                </div>
              ) : (
                <div className="product-price">
                  <span className="new-amount">
                    ₹ {productDetailData?.discount_price}
                  </span>
                  <span className="old-amount">
                    ₹ {productDetailData?.actual_price}
                  </span>
                  <span className="discount-text">35% OFF</span>
                </div>
              )}

              {gemstone && (
                <>
                <div className="product-add-ons">
                  <div className="add-ons-head">
                    <h2>Please select add ons</h2>
                    <a href="#">View all</a>
                  </div>
                  <div className="product-add-ons-listing">
                    {gemStoneJewelryData?.map((item, index) => (
                      <div className="single-add-on" key={index}>
                        <div className="add-on-img">
                          <img src={item?.astroGemstoneJewelryImg} alt="" />
                        </div>
                        <div className="add-on-details">
                          <div className="addon-name">{item?.name}</div>
                          <div className="addon-price">
                            ₹ {item?.actual_price}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              
              <div className="product-right-dropdown">
                <select>
                  <option>Select Ring Size</option>
                  <option>Free Size</option>
                  <option>I know my Ring Size</option>
                  <option>I don't know, please call me</option>
                </select>
              </div>
              </>
              )}
              <div className="product-right-btn">
                <button
                  onClick={() => {
                    router.push(
                      `/shop/${params?.slug}/${params?.id}/${
                        !productDetailData?.starting_price
                          ? `orderReview?uID=eyJjYXR`
                          : "consultant"
                      }`
                    );
                  }}
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="product-faqs-outer">
        <div className="container">
          <div className="product-faqs-inner">
            <div className="single-faq">
              <h3>What is the Origin & Carat Weight of the product ?</h3>
              <p>Origin - Africa</p>
              <p>Carat Weight - 4.55</p>
            </div>
            <div className="single-faq">
              <h3>What are its Benefits?</h3>
              <ul>
                <li>
                  Citrine expels negativity, instills positive energy, and
                  reduces depression.
                </li>
                <li>
                  Enhances clarity, boosts self-confidence, and promotes mental
                  growth.
                </li>
                <li>Brings success and prosperity to the wearer.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="product-testimonial-left-right-outer">
        <div className="container">
          <div className="product-testimonial-left-right-inner">
            <div className="product-testimonial-left">
              <h2>Customer Testimonials</h2>
              <div className="reviews-sec">
                <div className="single-review">
                  <div className="profile-image-name">
                    <div className="picture_profile">
                      <img alt="" />
                    </div>
                    <div className="name-text">
                      <span>Mohan LAL</span>
                    </div>
                  </div>
                  <div className="rating-stars">
                    <ul className="stars">
                      <li>
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          stroke-width="0"
                          viewBox="0 0 512 512"
                          height="1em"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M394 480a16 16 0 0 1-9.39-3L256 383.76 127.39 477a16 16 0 0 1-24.55-18.08L153 310.35 23 221.2a16 16 0 0 1 9-29.2h160.38l48.4-148.95a16 16 0 0 1 30.44 0l48.4 149H480a16 16 0 0 1 9.05 29.2L359 310.35l50.13 148.53A16 16 0 0 1 394 480z"></path>
                        </svg>
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          stroke-width="0"
                          viewBox="0 0 512 512"
                          height="1em"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M394 480a16 16 0 0 1-9.39-3L256 383.76 127.39 477a16 16 0 0 1-24.55-18.08L153 310.35 23 221.2a16 16 0 0 1 9-29.2h160.38l48.4-148.95a16 16 0 0 1 30.44 0l48.4 149H480a16 16 0 0 1 9.05 29.2L359 310.35l50.13 148.53A16 16 0 0 1 394 480z"></path>
                        </svg>
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          stroke-width="0"
                          viewBox="0 0 512 512"
                          height="1em"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M394 480a16 16 0 0 1-9.39-3L256 383.76 127.39 477a16 16 0 0 1-24.55-18.08L153 310.35 23 221.2a16 16 0 0 1 9-29.2h160.38l48.4-148.95a16 16 0 0 1 30.44 0l48.4 149H480a16 16 0 0 1 9.05 29.2L359 310.35l50.13 148.53A16 16 0 0 1 394 480z"></path>
                        </svg>
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          stroke-width="0"
                          viewBox="0 0 512 512"
                          height="1em"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M394 480a16 16 0 0 1-9.39-3L256 383.76 127.39 477a16 16 0 0 1-24.55-18.08L153 310.35 23 221.2a16 16 0 0 1 9-29.2h160.38l48.4-148.95a16 16 0 0 1 30.44 0l48.4 149H480a16 16 0 0 1 9.05 29.2L359 310.35l50.13 148.53A16 16 0 0 1 394 480z"></path>
                        </svg>
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          stroke-width="0"
                          viewBox="0 0 512 512"
                          height="1em"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M394 480a16 16 0 0 1-9.39-3L256 383.76 127.39 477a16 16 0 0 1-24.55-18.08L153 310.35 23 221.2a16 16 0 0 1 9-29.2h160.38l48.4-148.95a16 16 0 0 1 30.44 0l48.4 149H480a16 16 0 0 1 9.05 29.2L359 310.35l50.13 148.53A16 16 0 0 1 394 480z"></path>
                        </svg>
                      </li>
                    </ul>
                  </div>
                  <div className="review-content">
                    <p>Just Loved it amazing quality</p>
                  </div>
                </div>
                <div className="single-review">
                  <div className="profile-image-name">
                    <div className="picture_profile">
                      <img alt="" />
                    </div>
                    <div className="name-text">
                      <span>Mohan LAL</span>
                    </div>
                  </div>
                  <div className="rating-stars">
                    <ul className="stars">
                      <li>
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          stroke-width="0"
                          viewBox="0 0 512 512"
                          height="1em"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M394 480a16 16 0 0 1-9.39-3L256 383.76 127.39 477a16 16 0 0 1-24.55-18.08L153 310.35 23 221.2a16 16 0 0 1 9-29.2h160.38l48.4-148.95a16 16 0 0 1 30.44 0l48.4 149H480a16 16 0 0 1 9.05 29.2L359 310.35l50.13 148.53A16 16 0 0 1 394 480z"></path>
                        </svg>
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          stroke-width="0"
                          viewBox="0 0 512 512"
                          height="1em"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M394 480a16 16 0 0 1-9.39-3L256 383.76 127.39 477a16 16 0 0 1-24.55-18.08L153 310.35 23 221.2a16 16 0 0 1 9-29.2h160.38l48.4-148.95a16 16 0 0 1 30.44 0l48.4 149H480a16 16 0 0 1 9.05 29.2L359 310.35l50.13 148.53A16 16 0 0 1 394 480z"></path>
                        </svg>
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          stroke-width="0"
                          viewBox="0 0 512 512"
                          height="1em"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M394 480a16 16 0 0 1-9.39-3L256 383.76 127.39 477a16 16 0 0 1-24.55-18.08L153 310.35 23 221.2a16 16 0 0 1 9-29.2h160.38l48.4-148.95a16 16 0 0 1 30.44 0l48.4 149H480a16 16 0 0 1 9.05 29.2L359 310.35l50.13 148.53A16 16 0 0 1 394 480z"></path>
                        </svg>
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          stroke-width="0"
                          viewBox="0 0 512 512"
                          height="1em"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M394 480a16 16 0 0 1-9.39-3L256 383.76 127.39 477a16 16 0 0 1-24.55-18.08L153 310.35 23 221.2a16 16 0 0 1 9-29.2h160.38l48.4-148.95a16 16 0 0 1 30.44 0l48.4 149H480a16 16 0 0 1 9.05 29.2L359 310.35l50.13 148.53A16 16 0 0 1 394 480z"></path>
                        </svg>
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          stroke-width="0"
                          viewBox="0 0 512 512"
                          height="1em"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M394 480a16 16 0 0 1-9.39-3L256 383.76 127.39 477a16 16 0 0 1-24.55-18.08L153 310.35 23 221.2a16 16 0 0 1 9-29.2h160.38l48.4-148.95a16 16 0 0 1 30.44 0l48.4 149H480a16 16 0 0 1 9.05 29.2L359 310.35l50.13 148.53A16 16 0 0 1 394 480z"></path>
                        </svg>
                      </li>
                    </ul>
                  </div>
                  <div className="review-content">
                    <p>Just Loved it amazing quality</p>
                  </div>
                </div>
                <div className="single-review">
                  <div className="profile-image-name">
                    <div className="picture_profile">
                      <img alt="" />
                    </div>
                    <div className="name-text">
                      <span>Mohan LAL</span>
                    </div>
                  </div>
                  <div className="rating-stars">
                    <ul className="stars">
                      <li>
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          stroke-width="0"
                          viewBox="0 0 512 512"
                          height="1em"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M394 480a16 16 0 0 1-9.39-3L256 383.76 127.39 477a16 16 0 0 1-24.55-18.08L153 310.35 23 221.2a16 16 0 0 1 9-29.2h160.38l48.4-148.95a16 16 0 0 1 30.44 0l48.4 149H480a16 16 0 0 1 9.05 29.2L359 310.35l50.13 148.53A16 16 0 0 1 394 480z"></path>
                        </svg>
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          stroke-width="0"
                          viewBox="0 0 512 512"
                          height="1em"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M394 480a16 16 0 0 1-9.39-3L256 383.76 127.39 477a16 16 0 0 1-24.55-18.08L153 310.35 23 221.2a16 16 0 0 1 9-29.2h160.38l48.4-148.95a16 16 0 0 1 30.44 0l48.4 149H480a16 16 0 0 1 9.05 29.2L359 310.35l50.13 148.53A16 16 0 0 1 394 480z"></path>
                        </svg>
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          stroke-width="0"
                          viewBox="0 0 512 512"
                          height="1em"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M394 480a16 16 0 0 1-9.39-3L256 383.76 127.39 477a16 16 0 0 1-24.55-18.08L153 310.35 23 221.2a16 16 0 0 1 9-29.2h160.38l48.4-148.95a16 16 0 0 1 30.44 0l48.4 149H480a16 16 0 0 1 9.05 29.2L359 310.35l50.13 148.53A16 16 0 0 1 394 480z"></path>
                        </svg>
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          stroke-width="0"
                          viewBox="0 0 512 512"
                          height="1em"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M394 480a16 16 0 0 1-9.39-3L256 383.76 127.39 477a16 16 0 0 1-24.55-18.08L153 310.35 23 221.2a16 16 0 0 1 9-29.2h160.38l48.4-148.95a16 16 0 0 1 30.44 0l48.4 149H480a16 16 0 0 1 9.05 29.2L359 310.35l50.13 148.53A16 16 0 0 1 394 480z"></path>
                        </svg>
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          stroke-width="0"
                          viewBox="0 0 512 512"
                          height="1em"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M394 480a16 16 0 0 1-9.39-3L256 383.76 127.39 477a16 16 0 0 1-24.55-18.08L153 310.35 23 221.2a16 16 0 0 1 9-29.2h160.38l48.4-148.95a16 16 0 0 1 30.44 0l48.4 149H480a16 16 0 0 1 9.05 29.2L359 310.35l50.13 148.53A16 16 0 0 1 394 480z"></path>
                        </svg>
                      </li>
                    </ul>
                  </div>
                  <div className="review-content">
                    <p>Just Loved it amazing quality</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="product-promises-right">
              <h2>Astrotalk Promises</h2>
              <div className="promise-box-sec">
                <p>
                  AstroMall is a one - stop shop for all your astrological
                  needs. Apart from providing you the most genuine and lab -
                  certified products like Gemstones, Kavach, Yantras, etc.
                  AstroMall also assures excellence in providing services like
                  Reiki healing, Past life regression, Consultation, etc. All
                  these products and services on AstroMall comes with the
                  promise of genuineness and are attuned and energised to your
                  personal needs. If you have any queries about any of our
                  products or services, you can simply reach out to our customer
                  care executives.
                </p>
                <div className="promise-btns">
                  <a href="#">Talk to Astrologer</a>
                  <a href="#">Chat with Astrologer</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductDetail;
