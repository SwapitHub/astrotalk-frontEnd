"use client";
import RingGemstonePopUp from "@/app/component/RingGemstonePopUp";
import SelectAddGemstoneRing from "@/app/component/SelectAddGemstoneRing";
import ThumbNellTabbing from "@/app/component/ThumbNellTabbing";
import axios from "axios";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import UserOtpLoginData from "@/app/component/UserOtpLoginData";
import DOMPurify from "dompurify";
import he from "he";
import { toast } from "react-toastify";
import Loader from "@/app/component/Loader";

const ProductDetail = ({ productDetailData }) => {

  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const userMobiles = Math.round(Cookies.get("userMobile"));
  const gemstone = searchParams.get("gemstone");
  const [gemStoneJewelryData, setGemStoneJewelryData] = useState();
  const [viewAllBtn, setViewAllBtn] = useState(false);
  const [gemstoneData, setGemstoneData] = useState();
  const [decodedHtml, setDecodedHtml] = useState("");
  const [decodedHtmlDescription, setDecodedHtmlDescription] = useState("");

  const [otpPopUpDisplay, setOtpPopUpDisplay] = useState(false);

  const discountPrice =
    productDetailData?.actual_price - productDetailData?.discount_price;
  const offPercentage = Math.floor(
    (discountPrice / productDetailData?.actual_price) * 100
  );

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
    handleGemStoneJewelry();
  }, []);

  useEffect(() => {
    if (viewAllBtn) {
      document.body.classList.add("ring-opened");
    } else {
      document.body.classList.remove("ring-opened");
    }

    return () => {
      document.body.classList.remove("ring-opened");
    };
  }, [viewAllBtn]);

  const handleBookNow = async () => {
    if (!userMobiles) {
      setOtpPopUpDisplay(true);
      return;
    }

    const selectEl = document.getElementById("ringSizeSelect");
    const inputEl = document.getElementById("ringSize");

    let ring_size = "";
    if (gemstoneData?.productType == "Ring") {
      if (selectEl?.value === "I know my Ring Size") {
        ring_size = inputEl?.value.trim();
        if (!ring_size) {
          toast.warn("Please enter your ring size", {
            position: "top-right",
          });
          return;
        }
      } else {
        ring_size = selectEl?.value;
        if (!ring_size || ring_size === "Select Ring Size") {
          toast.warn("Please select a ring size", {
            position: "top-right",
          });
          return;
        }
      }
    } else {
      ring_size = "";
    }

    if (productDetailData?.shop_product_type == "gemstone_product" || productDetailData?.shop_product_type == "another_product") {
      try {
        const res = await axios.put(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}/update-any-field-astro-shope-product/${productDetailData?._id}`,
          {
            ring_size,
            gemStone_product_price: gemstoneData?.actual_price || "",
            product_type_gem: gemstoneData?.productType || "",
          }
        );

        if (res?.status === 200) {
          router.push(`/shop/${params?.slug}/${params?.id}/fillIntake`);
        }
      } catch (error) {
        console.error("Error updating ring size", error);
      }
    } else if (productDetailData?.shop_product_type == "astrologer_puja") {
      router.push(`/shop/${params?.slug}/${params?.id}/consultant`);
    }
  };

  useEffect(() => {
    if (productDetailData?.detail_information) {
      const decoded = he.decode(productDetailData?.detail_information);

      const sanitizedHtml = DOMPurify.sanitize(decoded);

      setDecodedHtml(sanitizedHtml);
    }
  }, [productDetailData]);


  useEffect(() => {
    if (productDetailData?.description) {
      const decoded = he.decode(productDetailData?.description);

      const sanitizedHtml = DOMPurify.sanitize(decoded);

      setDecodedHtmlDescription(sanitizedHtml);
    }
  }, [productDetailData]);

  return (
    <div className="product-detail-main">
      <RingGemstonePopUp
        setViewAllBtn={setViewAllBtn}
        gemStoneJewelryData={gemStoneJewelryData}
        gemstoneData={gemstoneData}
        setGemstoneData={setGemstoneData}
        viewAllBtn={viewAllBtn}
      />

      {otpPopUpDisplay && (
        <div className={otpPopUpDisplay == true && `outer-send-otp-main`}>
          <UserOtpLoginData setOtpPopUpDisplay={setOtpPopUpDisplay} />
        </div>
      )}

      {!productDetailData && <Loader />}

      <div className="breadcrumb-outer">
        <div className="container">
          <div className="breadcrumb">
            <ul>
              <li>
                <Link href="/chat-with-astrologer">
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
                </Link>
                <Link href="/shop">Astromall</Link>
                <Link href={`/shop/${productDetailData?.shop_slug}`}>
                  {gemstone ? "Gemstone" : productDetailData?.name}
                </Link>
                <span className="text">{productDetailData?.name}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <section className="products-details-outer">
        <div className="container">
          <div className="products-details-inner">
            <div className="product-images-left">
              <ThumbNellTabbing productDetailData={productDetailData} />
            </div>
            <div className="product-details-right">
              <div className="product-right-desc">
                <h1>{productDetailData?.name}</h1>
                {decodedHtmlDescription !== "<p>undefined</p>" &&
                  decodedHtmlDescription !== "undefined" &&
                  decodedHtmlDescription.trim().length > 0 && (
                    <p>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: decodedHtmlDescription,
                        }}
                      />
                    </p>
                  )}
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
                  {productDetailData?.actual_price != 0 && (
                    <span className="old-amount">
                      ₹ {productDetailData?.actual_price}
                    </span>
                  )}

                  {productDetailData?.actual_price != 0 && (
                    <span className="discount-text">{offPercentage}% OFF</span>
                  )}
                </div>
              )}

              {gemstone && (
                <>
                  <SelectAddGemstoneRing
                    setViewAllBtn={setViewAllBtn}
                    gemStoneJewelryData={gemStoneJewelryData}
                    gemstoneData={gemstoneData}
                    setGemstoneData={setGemstoneData}
                  />
                </>
              )}
              <div className="product-right-btn">
                <button
                  onClick={() => {
                    handleBookNow();
                  }}
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {decodedHtml !== "<p>undefined</p>" &&
        decodedHtml !== "undefined" &&
        decodedHtml.trim().length > 0 && (
          <section className="product-faqs-outer">
            <div className="container">
              <div dangerouslySetInnerHTML={{ __html: decodedHtml }} />
            </div>
          </section>
        )}
      <section className="product-testimonial-left-right-outer">
        <div className="container">
          <div className="product-testimonial-left-right-inner">
            <div className="product-testimonial-left">
              <h2>Customer Testimonials</h2>
              <div className="reviews-sec">
                <div className="single-review">
                  <div className="profile-stars-outer">
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
                  </div>
                  <div className="review-content">
                    <p>Just Loved it amazing quality</p>
                  </div>
                </div>
                <div className="single-review">
                  <div className="profile-stars-outer">
                    <div className="profile-image-name">
                      <div className="picture_profile">
                        <img alt="" />
                      </div>
                      <div className="name-text">
                        <span>Rosan LAL</span>
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
                  </div>
                  <div className="review-content">
                    <p>Just Loved it amazing quality</p>
                  </div>
                </div>
                <div className="single-review">
                  <div className="profile-stars-outer">
                    <div className="profile-image-name">
                      <div className="picture_profile">
                        <img alt="" />
                      </div>
                      <div className="name-text">
                        <span>Dinesh Sharma</span>
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
                  </div>
                  <div className="review-content">
                    <p>Good</p>
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
                  {/* <a href="#">Talk to Astrologer</a> */}
                  <Link href="/chat-with-astrologer">Chat with Astrologer</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
