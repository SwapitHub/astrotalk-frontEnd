"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";

const TalkAstrologer = () => {
  const [showAstrologer, setShowAstrologer] = useState();
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/astrologer-list`)
      .then((res) => {
        console.log(res.data);
        setShowAstrologer(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <section className="talk-to-astrologer-bg">
      <div className="container">
        <div className="inner-talk-to-astrologer">
          <div className="talk-to-astrologer-left-content">
            <div className="heading-button">
              <span>Talk to Astrologer</span>
            </div>
            <div className="available-bbalance-text">
              <p>
                Available balance: <span>₹ 0</span>
              </p>
            </div>
          </div>
          <div className="talk-to-astrologer-right-content">
            <div className="inner-talk-to-astrologer-right-content">
              <div className="recharge-btm">
                <a href="#" title="Recharge" className="recharge-button">
                  Recharge
                </a>
              </div>
              <div className="filter-button">
                <a href="#" title="Recharge" className="filter-btn-ctm">
                  <i _ngcontent-serverapp-c100="" className="fa fa-filter"></i>
                  Filter
                </a>
              </div>
              <div className="filter-button">
                <a href="#" title="Recharge" className="sort-btn-ctm">
                  <i
                    _ngcontent-serverapp-c100=""
                    className="fa fa-sort-amount-desc"
                  ></i>{" "}
                  Sort by{" "}
                </a>
              </div>
              <div className="filter-button search-box-top-btn">
                <div className="search-box-filed">
                  <input
                    type="search"
                    id="gsearch"
                    name="gsearch"
                    placeholder="Search name..."
                  />
                </div>
                <div className="search-button-filed">
                  <button type="submit">
                    <i className="fa fa-search"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="all-list-talk-to-astrologer">
          {showAstrologer?.map((item) => {
            return (
              <div className="inner-astrologer-detail" key={item.id}>
                <div className="astrologer-list-left">
                  <div className="astrologer-profile">
                    <a href="#" title="Shriniwas">
                      {" "}
                      <img src="./astrologer-person-img.jpg" alt="Sauvikh" />
                    </a>
                  </div>
                  <div className="five-star-rating">
                    <ul>
                      <li>
                        <i className="fa-solid fa-star"></i>
                      </li>
                      <li>
                        <i className="fa-solid fa-star"></i>
                      </li>
                      <li>
                        <i className="fa-solid fa-star"></i>
                      </li>
                      <li>
                        <i className="fa-solid fa-star"></i>
                      </li>
                      <li>
                        <i className="fa-solid fa-star"></i>
                      </li>
                    </ul>
                  </div>
                  <div className="talk-to-total-orders">
                    <p> 3673 orders</p>
                  </div>
                </div>
                <div className="astrologer-list-center">
                  <div className="talk-to-name-sec">
                    <h5>
                      <a href="#" title="Shriniwas">
                       {item.name}
                      </a>
                    </h5>
                    <p>Vedic, Numerology, Vastu</p>
                  </div>
                  <div className="talk-to-language">
                    <p>
                      <span>{item.languages}</span> <span>English,</span>
                    </p>
                  </div>
                  <div className="exp-year-sec">
                    <p>
                      Exp: <span className="ctm-carly-breaks">4</span> Years
                    </p>
                  </div>
                  <div className="talk-to-time-sec">
                    <p>
                      ₹ 5{" "}
                      <span>
                        <span className="ctm-carly-breaks">24</span>
                        <span className="ctm-carly-breaks">/</span>
                        min
                      </span>
                    </p>
                  </div>
                </div>
                <div className="astrologer-list-right">
                  <div className="Verified-Sticker-icon">
                    <img src="./Verified-Sticker.png" alt="Verified Sticker" />
                  </div>
                  <div className="astrologer-call-button-ctm">
                    <button type="submit">Call </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TalkAstrologer;
