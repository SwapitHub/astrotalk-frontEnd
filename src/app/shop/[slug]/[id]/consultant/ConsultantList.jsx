"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import ShopIdGetGlobal from "../../ShopIdGetGlobal";
import { useParams, useRouter } from "next/navigation";

const ConsultantList = () => {
  const route = useRouter();
  const params = useParams();
  const [astrShopDetailData, setAstrShopDetailData] = useState([]);
  const [astrologerServiceListData, setAstrologerServiceListData] = useState(
    []
  );
  console.log(astrologerServiceListData);
  console.log(astrShopDetailData);
  console.log(params);

  const handleGetAstrologer = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/astrologer-list-spiritual-service/${astrShopDetailData?._id}`
      );

      const result = await response.json();
      console.log(result);

      setAstrologerServiceListData(result.data);
    } catch (err) {
      console.log("astrologer service list api err", err);
    }
  };

  useEffect(() => {
    handleGetAstrologer();
  }, [astrShopDetailData]);
  return (
    <>
      <ShopIdGetGlobal
        astrShopDetailData={astrShopDetailData}
        setAstrShopDetailData={setAstrShopDetailData}
      />
      <div className="breadcrumb container">
        <ul>
          <li>
            <Link href="#">Evil Eye Removal (Buri Nazar Nivaran)</Link>
            <Link href="#">Evil Eye (Nazar Lagna) for Family</Link>
            <span className="text">Consultant List</span>
          </li>
        </ul>
      </div>
      <section className="consultant-listing-outer">
        <div className="container">
          <div className="consultant-listing-inner">
            <div className="consultant-heading">
              <h1>Select Consultant</h1>
            </div>
            <div className="consultant-listing-sec all-list-talk-to-astrologer" >
            {astrologerServiceListData.map((item, index) => (
              
                <div className="single-consultant inner-astrologer-detail" key={index}>
                  <div className="main-anchor">
                    <div className="star-banner">Celebrity</div>
                    <div className="astrologer-list-left">
                      <div className="astrologer-profile">
                        <img alt={item?.name} src={item?.profileImage} />
                      </div>
                      <div className="five-star-rating">
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
                              <path
                                fill="none"
                                stroke-linejoin="round"
                                stroke-width="32"
                                d="M480 208H308L256 48l-52 160H32l140 96-54 160 138-100 138 100-54-160z"
                              ></path>
                              <path d="M256 48v316L118 464l54-160-140-96h172l52-160z"></path>
                            </svg>
                          </li>
                        </ul>
                      </div>
                      <div className="talk-to-total-orders">
                        <p> {item?.totalOrders} orders</p>
                      </div>
                    </div>
                    <div className="astrologer-list-center">
                      <div className="talk-to-name-sec">
                        <h5>{item?.name}</h5>
                        <div className="skills">
                          {item.professions.map((prof, index) => (
                            <span key={index}>{prof}</span>
                          ))}
                        </div>
                      </div>
                      <div className="talk-to-language">
                        {item.languages.map((lan, index) => (
                          <span key={index}>{lan}</span>
                        ))}
                      </div>
                      <div className="exp-year-sec">
                        <p>
                          Exp:{" "}
                          <span className="ctm-carly-breaks">
                            {item?.experience}
                          </span>{" "}
                          Years
                        </p>
                      </div>
                      <div className="talk-to-time-sec">
                        <p>
                          ₹
                          {item.spiritual_services
                            .filter(
                              (service) =>
                                service?.shop_id === astrShopDetailData?._id
                            )
                            .map((service) => service?.service_price)}
                        </p>
                      </div>
                    </div>
                    <div className="astrologer-list-right">
                      <div className="Verified-Sticker-icon">
                        <img
                          alt="Verified Sticker"
                          src="./Verified-Sticker.png"
                        />
                      </div>
                      <div className="astrologer-call-button-ctm">
                        <button
                          onClick={() =>
                            route.push(
                              `/shop/${params.slug}/${params.id}/orderReview/?shop-id=${astrShopDetailData?._id}&astrologer-id=${item._id}`
                            )
                          }
                        >
                          Select
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              
            ))}
          </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ConsultantList;
