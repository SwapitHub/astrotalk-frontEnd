"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import OtpData from "../component/OtpData";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { HiOutlineMail } from "react-icons/hi";
import useCustomGetApi from "../hook/CustomHookGetApi";

const Footer = () => {
  const pathname = usePathname();
  const parts = pathname.split("/");
  const [otpPopUpDisplayAstro, setOtpPopUpDisplayAstro] = useState(false);
  const [astrologerPhone, setAstrologerPhone] = useState();
  const { data: footerData, loading } = useCustomGetApi(
    "get-footerProduct-astrologer"
  );


  useEffect(() => {
    const astrologerPhone = Cookies.get("astrologer-phone");
    setAstrologerPhone(astrologerPhone);
  }, []);

  const handleOtpPop = () => {
    if (!astrologerPhone) {
      setOtpPopUpDisplayAstro(true);
    }
  };

  return (
    <>
      {parts[1] == "admin" || parts[1] == "astrologer" || (parts[1] == "chat-with-astrologer" && parts[2]=="astrologer") ? (
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
                      <Link href="">Today's Horoscope</Link>
                    </li>
                    <li>
                      <Link href=""> Today's Love Horoscope</Link>
                    </li>
                  </ul>
                </div>
                <div class="discript_text-link">
                  <Link href="/chat-with-astrologer">
                    {" "}
                    <span class="icon"></span> We are available 24x7 on chat
                    support <span class="footer-btn">click to start chat</span>{" "}
                  </Link>
                </div>
                <div class="email-wrapper">
                  <Link href="mailto:contact@astrotalk.com">
                    <HiOutlineMail />
                    <span>Email ID:</span>contact@astrotalk.com
                  </Link>
                </div>
                {/* <div class="footer-social">
                  <div class="icons">
                    <Link href=""></Link>
                  </div>
                  <div class="icons">
                    <Link href=""></Link>
                  </div>
                  <div class="icons">
                    <Link href=""></Link>
                  </div>
                  <div class="icons">
                    <Link href=""></Link>
                  </div>
                </div> */}
              </div>

              <div class="footer-col">
                <div class="top-col">
                  <h3>Important Links</h3>
                  <ul>
                    <li>
                      <Link href="/shop">Astromall</Link>
                    </li>
                    <li>
                      <Link href="/chat-with-astrologer">chat now</Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="footer-col">
                <div class="top-col">
                  <h3>Astrologer</h3>
                  <ul>
                    <li>
                      <OtpData
                        setOtpPopUpDisplayAstro={setOtpPopUpDisplayAstro}
                        otpPopUpDisplayAstro={otpPopUpDisplayAstro}
                      />
                      <span onClick={handleOtpPop}>Astrologer Login</span>
                    </li>
                    <li>
                      <Link href="/signup"> Astrologer Registration</Link>
                    </li>
                  </ul>
                </div>
                {/* <div class="bottom-col">
                  <div class="secure_col">
                    <h3>Secure</h3>
                    <ul>
                      <li>
                        <Link href="">
                          <span class="icon">
                            <img src="/private_home.png" alt="private_home" />
                          </span>
                          <span class="icon-text">Private & Confidential</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="">
                          <span class="icon">
                            <img src="/verifired.png" alt="verifired" />
                          </span>
                          <span class="icon-text">Verified Astrologers</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="">
                          <span class="icon">
                            <img src="/secure_pay.png" alt="secure_pay" />
                          </span>
                          <span class="icon-text">Secure Payments</span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div class="download-app">
                        <ul>
                            <li><Link href=""><img src="/android.png" alt=""/></Link></li>
                            <li><Link href=""><img src="/ios.png" alt=""/></Link></li>
                        </ul>
                    </div>
                </div> */}
              </div>
              <div class="footer-col">
                <h3>Shop our products</h3>
                <ul>
                  {footerData.map((item) => (
                    <li key={item?.id}>
                      <Link href={item?.footerProductLink}>
                        {item?.footerProductName}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          {/* <!---- Footer Menus ---> */}
          <div class="copyright">
            <p>
              Copyright © 2025 Astrotalk (Powered by Swap It Hub). All Rights
              Reserved
            </p>
          </div>
        </footer>
      )}
    </>
  );
};

export default Footer;
