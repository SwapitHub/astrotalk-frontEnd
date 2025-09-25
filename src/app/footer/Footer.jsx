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
      {parts[1] == "admin" ||
      parts[1] == "astrologer" ||
      (parts[1] == "chat-with-astrologer" && parts[2] == "astrologer") ? (
        ""
      ) : (
        <footer className="footer">
          <div className="container">
            {/* <!---- Footer Top Content ---> */}
            <div className="top-content">
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
            <div className="footer-menu">
              <div className="footer-col">
                <div className="top-col">
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
                <div className="discript_text-link">
                  <Link href="/chat-with-astrologer">
                    {" "}
                    <span className="icon"></span>We are available 24x7 on chat
                    support <span className="footer-btn">click to start chat</span>{" "}
                  </Link>
                </div>
                <div className="email-wrapper">
                  <Link href="mailto:contact@astrotalk.com">
                    <HiOutlineMail />
                    <span>Email ID:</span>contact@astrotalk.com
                  </Link>
                </div>
                {/* <div className="footer-social">
                  <div className="icons">
                    <Link href=""></Link>
                  </div>
                  <div className="icons">
                    <Link href=""></Link>
                  </div>
                  <div className="icons">
                    <Link href=""></Link>
                  </div>
                  <div className="icons">
                    <Link href=""></Link>
                  </div>
                </div> */}
              </div>

              <div className="footer-col">
                <div className="top-col">
                  <h3>Important Links</h3>
                  <ul>
                    <li>
                      <Link href="/shop">Astromall</Link>
                    </li>
                    <li>
                      <Link href="/chat-with-astrologer">chat now</Link>
                    </li>
                    <li>
                      <Link href="/astrology-blog">Blogs</Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="footer-col">
                <div className="top-col">
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
                {/* <div className="bottom-col">
                  <div className="secure_col">
                    <h3>Secure</h3>
                    <ul>
                      <li>
                        <Link href="">
                          <span className="icon">
                            <img src="/private_home.png" alt="private_home" />
                          </span>
                          <span className="icon-text">Private & Confidential</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="">
                          <span className="icon">
                            <img src="/verifired.png" alt="verifired" />
                          </span>
                          <span className="icon-text">Verified Astrologers</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="">
                          <span className="icon">
                            <img src="/secure_pay.png" alt="secure_pay" />
                          </span>
                          <span className="icon-text">Secure Payments</span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="download-app">
                        <ul>
                            <li><Link href=""><img src="/android.png" alt=""/></Link></li>
                            <li><Link href=""><img src="/ios.png" alt=""/></Link></li>
                        </ul>
                    </div>
                </div> */}
              </div>
              <div className="footer-col">
                <h3>Shop our products</h3>
                <ul>
                  {footerData.map((item, id) => (
                    <li key={id}>
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
          <div className="copyright">
            <p>
              Copyright © 2025 Wedding Byte (Powered by Swap It Hub). All Rights
              Reserved
            </p>
          </div>
        </footer>
      )}
    </>
  );
};

export default Footer;
