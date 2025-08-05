"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import secureLocalStorage from "react-secure-storage";

const Footer = () => {
  const [astrologerPhone, setAstrologerPhone] = useState();
  const admin_id = secureLocalStorage.getItem("admin_id");

  useEffect(() => {
    const astrologerPhone = Cookies.get("astrologer-phone");
    setAstrologerPhone(astrologerPhone);
  }, []);
  return (
    <>
      {astrologerPhone || admin_id ? (
        ""
      ) : (
        <footer class="footer">
          <div class="container">
            {/* <!---- Footer Top Content ---> */}
            <div class="top-content">
              <h2>About Astrotalk</h2>
              <p>
                Astrotalk is the best astrology website for online Astrology
                predictions. Talk to Astrologer on call and get answers to all
                your worries by seeing the future life through Astrology Kundli
                Predictions from the best Astrologers from India. Get best
                future predictions related to Marriage, love life, Career or
                Health over call, chat, query or report.
              </p>
            </div>
            {/* <!---- Footer Menus ---> */}
            <div class="footer-menu">
              <div class="footer-col">
                <div class="top-col">
                  <h3>Horoscope</h3>
                  <ul>
                    <li>
                      <a href="">Today's Horoscope</a>
                    </li>
                    <li>
                      <a href=""> Today's Love Horoscope</a>
                    </li>
                    <li>
                      <a href=""> Yesterday's Horoscope</a>
                    </li>
                    <li>
                      <a href=""> Tomorrow's Horoscope</a>
                    </li>
                    <li>
                      <a href=""> Weekly Horoscope</a>
                    </li>
                    <li>
                      <a href=""> Monthly Horoscope</a>
                    </li>
                    <li>
                      <a href=""> Yearly Horoscope</a>
                    </li>
                  </ul>
                </div>
                <div class="bottom-col">
                  <h3> Shubh Muhurat 2025</h3>
                  <ul>
                    <li>
                      <a href=""> Annanprashan Muhurat 2025</a>
                    </li>
                    <li>
                      <a href=""> Naamkaran Muhurat 2025</a>
                    </li>
                    <li>
                      <a href=""> Car/Bike Muhurat 2025</a>
                    </li>
                    <li>
                      <a href=""> Marriage Muhurat 2025</a>
                    </li>
                    <li>
                      <a href=""> Gold Buying Muhurat 2025</a>
                    </li>
                    <li>
                      <a href=""> Bhoomi Pujan Muhurat 2025</a>
                    </li>
                    <li>
                      <a href=""> Griha Pravesh Muhurat 2025</a>
                    </li>
                    <li>
                      <a href=""> Mundan Muhurat 2025</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="footer-col">
                <h3>Important Links</h3>
                <ul>
                  <li>
                    <a href="">Astromall</a>
                  </li>
                  <li>
                    <a href="">Astrotalk Store</a>
                  </li>
                  <li>
                    <a href="">Today Panchang</a>
                  </li>
                  <li>
                    <a href="">Free Kundli</a>
                  </li>
                  <li>
                    <a href="">Kundli Matching</a>
                  </li>
                  <li>
                    <a href=""> Chat with Astrologer</a>
                  </li>
                  <li>
                    <a href=""> Talk to Astrologer</a>
                  </li>
                  <li>
                    <a href=""> Astrotalk Reviews</a>
                  </li>
                  <li>
                    <a href="">Astrology Yoga</a>
                  </li>
                  <li>
                    <a href="">Kaalsarp Doshas</a>
                  </li>
                  <li>
                    <a href="">Child Astrology</a>
                  </li>
                  <li>
                    <a href=""> Ascendant Sign Gemstone</a>
                  </li>
                  <li>
                    <a href=""> Nakshatras Constellations</a>
                  </li>
                  <li>
                    <a href="">Numerology</a>
                  </li>
                  <li>
                    <a href="">Mantras</a>
                  </li>
                  <li>
                    <a href=""> Astrological remedies for job promotion</a>
                  </li>
                </ul>
              </div>
              <div class="footer-col">
                <div class="top-col">
                  <h3>Important Links</h3>
                  <ul>
                    <li>
                      <a href="">Collaboration</a>
                    </li>
                    <li>
                      <a href="">Tarot</a>
                    </li>
                    <li>
                      <a href="">Zodiac Signs</a>
                    </li>
                    <li>
                      <a href="">Vastu Shastra</a>
                    </li>
                    <li>
                      <a href=""> Love Calculator</a>
                    </li>
                    <li>
                      <a href=""> Guru Purnima 2025</a>
                    </li>
                    <li>
                      <a href=""> Astrotalk Sitemap</a>
                    </li>
                  </ul>
                </div>
                <div class="bottom-col">
                  <h3>Shop our products</h3>
                  <ul>
                    <li>
                      <a href="">Evil Eye</a>
                    </li>
                    <li>
                      <a href="">Rudraksha</a>
                    </li>
                    <li>
                      <a href="">Karungali</a>
                    </li>
                    <li>
                      <a href="">Gemstones</a>
                    </li>
                    <li>
                      <a href="">Pyrite</a>
                    </li>
                    <li>
                      <a href="">Rudraksha Bracelet For Men</a>
                    </li>
                    <li>
                      <a href="">Rudraksha Bracelet For Women</a>
                    </li>
                    <li>
                      <a href="">Murtis and Idols</a>
                    </li>
                    <li>
                      <a href="">Raw Pyrite Stone</a>
                    </li>
                    <li>
                      <a href="">Money Magnet Bracelet</a>
                    </li>
                    <li>
                      <a href="">Khazani Ayurveda</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="footer-col">
                <div class="top-col">
                  <h3>Astrologer</h3>
                  <ul>
                    <li>
                      <a href=""> Astrologer Login</a>
                    </li>
                    <li>
                      <a href=""> Astrologer Registration</a>
                    </li>
                  </ul>
                </div>
                <div class="bottom-col">
                  <h3>Corporate Info</h3>
                  <ul>
                    <li>
                      <a href=""> Refund & Cancellation Policy</a>
                    </li>
                    <li>
                      <a href=""> Terms & Conditions</a>
                    </li>
                    <li>
                      <a href="">Privacy Policy</a>
                    </li>
                    <li>
                      <a href="">Disclaimer</a>
                    </li>
                    <li>
                      <a href="">About Us</a>
                    </li>
                    <li>
                      <a href="">Pricing Policy</a>
                    </li>
                  </ul>
                </div>
                <div class="discript_text-link">
                  <a href="">
                    {" "}
                    <span class="icon"></span> We are available 24x7 on chat
                    support <span class="footer-btn">click to start chat</span>{" "}
                  </a>
                </div>
                <div class="email-wrapper">
                  <a href="">contact@astrotalk.com</a>
                </div>
                <div class="footer-social">
                  <div class="icons">
                    <a href=""></a>
                  </div>
                  <div class="icons">
                    <a href=""></a>
                  </div>
                  <div class="icons">
                    <a href=""></a>
                  </div>
                  <div class="icons">
                    <a href=""></a>
                  </div>
                </div>
                <div class="secure_col">
                  <h3>Secure</h3>
                  <ul>
                    <li>
                      <a href="">
                        <span class="icon">
                          <img src="/private_home.png" alt="private_home" />
                        </span>
                        <span class="text">Private & Confidential</span>
                      </a>
                    </li>
                    <li>
                      <a href="">
                        <span class="icon">
                          <img src="/verifired.png" alt="verifired" />
                        </span>
                        <span class="text">Verified Astrologers</span>
                      </a>
                    </li>
                    <li>
                      <a href="">
                        <span class="icon">
                          <img src="/secure_pay.png" alt="secure_pay" />
                        </span>
                        <span class="text">Secure Payments</span>
                      </a>
                    </li>
                  </ul>
                </div>
                <div class="download-app">
                  <ul>
                    <li>
                      <a href="">
                        <img src="/android.png" alt="" />
                      </a>
                    </li>
                    <li>
                      <a href="">
                        <img src="/ios.png" alt="" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {/* <!---- Footer Menus ---> */}
          <div class="copyright">
            <p>
              Copyright © 2025 Astrotalk (Powered by MASKYETI SOLUTIONS PRIVATE
              LIMITED). All Rights Reserved
            </p>
          </div>
        </footer>
      )}
    </>
  );
};

export default Footer;
