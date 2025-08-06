"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();
  const parts = pathname.split("/");

  return (
    <>
      {parts[1] == "admin" || parts[1] == "astrologer" ? (
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
                {/* <div class="bottom-col">
                  <div class="secure_col">
                    <h3>Secure</h3>
                    <ul>
                      <li>
                        <a href="">
                          <span class="icon">
                            <img src="/private_home.png" alt="private_home" />
                          </span>
                          <span class="icon-text">Private & Confidential</span>
                        </a>
                      </li>
                      <li>
                        <a href="">
                          <span class="icon">
                            <img src="/verifired.png" alt="verifired" />
                          </span>
                          <span class="icon-text">Verified Astrologers</span>
                        </a>
                      </li>
                      <li>
                        <a href="">
                          <span class="icon">
                            <img src="/secure_pay.png" alt="secure_pay" />
                          </span>
                          <span class="icon-text">Secure Payments</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div class="download-app">
                        <ul>
                            <li><a href=""><img src="/android.png" alt=""/></a></li>
                            <li><a href=""><img src="/ios.png" alt=""/></a></li>
                        </ul>
                    </div>
                </div> */}
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
