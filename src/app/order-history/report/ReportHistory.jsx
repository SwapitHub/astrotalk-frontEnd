import Link from "next/link";
import React from "react";

const ReportHistory = () => {
  return (
    <section className="my-order-hisrory-bg">
      <div className="container">
        <div className="wallet-transactions-tabs">
          <div className="my-wallet-sec-transactions-tabs">
            <div className="my-wallet-sec-heading-content">
              <h1 className="common-h1-heading">Order History</h1>
            </div>
            <div className="wallet-ctm-tab-menu ">
              <ul>
                {/* <li>
                  <Link
                    href="/order-history/call"
                    className="wallet-ctm-tab-a"
                    data-id="wallet-ctm-tab1"
                  >
                    Call
                  </Link>
                </li> */}
                <li>
                  <Link
                    href="/order-history/chat"
                    className="wallet-ctm-tab-a"
                    data-id="wallet-ctm-tab2"
                  >
                    Chat
                  </Link>
                </li>
                <li>
                  <Link
                    href="/order-history/report"
                    className="wallet-ctm-tab-a wallet-ctm-active-a"
                    data-id="wallet-ctm-tab3"
                  >
                    Report
                  </Link>
                </li>
                <li>
                  <Link
                    title="/order-history/astro-mall"
                    href=""
                    className="wallet-ctm-tab-a"
                    data-id="wallet-ctm-tab4"
                  >
                    Astromall
                  </Link>
                </li>
              </ul>
            </div>
            <div
              className="wallet-ctm-tab wallet-ctm-tab-active"
              data-id="wallet-ctm-tab1"
            >
              <div className="ctm-chat-with-astrologer">
                <div className="inner-ctm-chat-with-astrologer">
                  <div className="inner-ctm-chat-with-astrologer-top">
                    <a href="#" title="Astrologer">
                      <div className="order-id-sec">
                        <ul>
                          <li>
                            <p>Order Id: #1732450779437</p>
                          </li>
                          <li className="help-list-button-ctm">
                            <button type="button" className="help-ctm-ctm">
                              HELP
                            </button>
                          </li>
                        </ul>
                      </div>
                      <div className="chat-astrologer-name-sec">
                        <h5>Shriniwas</h5>
                        <p>Vedic, Numerology, Vastu</p>
                      </div>
                      <div className="date-and-tine-sec">
                        <p>24 Nov 24, 05:49 PM</p>
                      </div>
                      <div className="chat-completed-content">
                        <p className="ctm-color-green">Completed </p>
                      </div>
                      <div className="call-rate-text">
                        <p>Rate: ₹ 20/min </p>
                      </div>
                      <div className="duration-history-text">
                        <p>Deduction: ₹ 140 </p>
                      </div>
                    </a>
                  </div>
                  <div className="inner-ctm-chat-with-astrologer-botton">
                    <div className="share-with-frnds-chat">
                      <p>
                        <a href="#" title="Share with your friends">
                          <img src="/what-sap-icon.webp" alt="whatsapp" />
                          <span>Share with your friends</span>{" "}
                        </a>
                      </p>
                    </div>
                    <div className="history-delete-button-ctm">
                      <a href="#" title="Delete">
                        <i className="fa-solid fa-trash"></i>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="inner-ctm-chat-with-astrologer">
                  <div className="inner-ctm-chat-with-astrologer-top">
                    <a href="#" title="Astrologer">
                      <div className="order-id-sec">
                        <ul>
                          <li>
                            <p>Order Id: #1732450779437</p>
                          </li>
                          <li className="help-list-button-ctm">
                            <button type="button" className="help-ctm-ctm">
                              HELP
                            </button>
                          </li>
                        </ul>
                      </div>
                      <div className="chat-astrologer-name-sec">
                        <h5>Shriniwas</h5>
                        <p>Vedic, Numerology, Vastu</p>
                      </div>
                      <div className="date-and-tine-sec">
                        <p>24 Nov 24, 05:49 PM</p>
                      </div>
                      <div className="chat-completed-content">
                        <p className="ctm-color-green">Completed </p>
                      </div>
                      <div className="call-rate-text">
                        <p>Rate: ₹ 20/min </p>
                      </div>
                      <div className="duration-history-text">
                        <p>Deduction: ₹ 140 </p>
                      </div>
                    </a>
                  </div>
                  <div className="inner-ctm-chat-with-astrologer-botton">
                    <div className="share-with-frnds-chat">
                      <p>
                        <a href="#" title="Share with your friends">
                          <img src="/what-sap-icon.webp" alt="whatsapp" />
                          <span>Share with your friends</span>{" "}
                        </a>
                      </p>
                    </div>
                    <div className="history-delete-button-ctm">
                      <a href="#" title="Delete">
                        <i className="fa-solid fa-trash"></i>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="inner-ctm-chat-with-astrologer">
                  <div className="inner-ctm-chat-with-astrologer-top">
                    <a href="#" title="Astrologer">
                      <div className="order-id-sec">
                        <ul>
                          <li>
                            <p>Order Id: #1732450779437</p>
                          </li>
                          <li className="help-list-button-ctm">
                            <button type="button" className="help-ctm-ctm">
                              HELP
                            </button>
                          </li>
                        </ul>
                      </div>
                      <div className="chat-astrologer-name-sec">
                        <h5>Shriniwas</h5>
                        <p>Vedic, Numerology, Vastu</p>
                      </div>
                      <div className="date-and-tine-sec">
                        <p>24 Nov 24, 05:49 PM</p>
                      </div>
                      <div className="chat-completed-content">
                        <p className="ctm-color-green">Completed </p>
                      </div>
                      <div className="call-rate-text">
                        <p>Rate: ₹ 20/min </p>
                      </div>
                      <div className="duration-history-text">
                        <p>Deduction: ₹ 140 </p>
                      </div>
                    </a>
                  </div>
                  <div className="inner-ctm-chat-with-astrologer-botton">
                    <div className="share-with-frnds-chat">
                      <p>
                        <a href="#" title="Share with your friends">
                          <img src="/what-sap-icon.webp" alt="whatsapp" />
                          <span>Share with your friends</span>{" "}
                        </a>
                      </p>
                    </div>
                    <div className="history-delete-button-ctm">
                      <a href="#" title="Delete">
                        <i className="fa-solid fa-trash"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="wallet-ctm-tab " data-id="wallet-ctm-tab2">
              <div className="ctm-chat-with-astrologer">
                <div className="inner-ctm-chat-with-astrologer">
                  <div className="inner-ctm-chat-with-astrologer-top">
                    <a href="#" title="Astrologer">
                      <div className="order-id-sec">
                        <ul>
                          <li>
                            <p>Order Id: #1732450779437</p>
                          </li>
                          <li className="help-list-button-ctm">
                            <button type="button" className="help-ctm-ctm">
                              HELP
                            </button>
                          </li>
                        </ul>
                      </div>
                      <div className="chat-astrologer-name-sec">
                        <h5>Shriniwas</h5>
                        <p>Vedic, Numerology, Vastu</p>
                      </div>
                      <div className="date-and-tine-sec">
                        <p>24 Nov 24, 05:49 PM</p>
                      </div>
                      <div className="chat-completed-content">
                        <p className="ctm-color-green">Completed </p>
                      </div>
                      <div className="call-rate-text">
                        <p>Rate: ₹ 20/min </p>
                      </div>
                      <div className="duration-history-text">
                        <p>Deduction: ₹ 140 </p>
                      </div>
                    </a>
                  </div>
                  <div className="inner-ctm-chat-with-astrologer-botton">
                    <div className="share-with-frnds-chat">
                      <p>
                        <a href="#" title="Share with your friends">
                          <img src="/what-sap-icon.webp" alt="whatsapp" />
                          <span>Share with your friends</span>{" "}
                        </a>
                      </p>
                    </div>
                    <div className="history-delete-button-ctm">
                      <a href="#" title="Delete">
                        <i className="fa-solid fa-trash"></i>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="inner-ctm-chat-with-astrologer">
                  <div className="inner-ctm-chat-with-astrologer-top">
                    <a href="#" title="Astrologer">
                      <div className="order-id-sec">
                        <ul>
                          <li>
                            <p>Order Id: #1732450779437</p>
                          </li>
                          <li className="help-list-button-ctm">
                            <button type="button" className="help-ctm-ctm">
                              HELP
                            </button>
                          </li>
                        </ul>
                      </div>
                      <div className="chat-astrologer-name-sec">
                        <h5>Shriniwas</h5>
                        <p>Vedic, Numerology, Vastu</p>
                      </div>
                      <div className="date-and-tine-sec">
                        <p>24 Nov 24, 05:49 PM</p>
                      </div>
                      <div className="chat-completed-content">
                        <p className="ctm-color-green">Completed </p>
                      </div>
                      <div className="call-rate-text">
                        <p>Rate: ₹ 20/min </p>
                      </div>
                      <div className="duration-history-text">
                        <p>Deduction: ₹ 140 </p>
                      </div>
                    </a>
                  </div>
                  <div className="inner-ctm-chat-with-astrologer-botton">
                    <div className="share-with-frnds-chat">
                      <p>
                        <a href="#" title="Share with your friends">
                          <img src="/what-sap-icon.webp" alt="whatsapp" />
                          <span>Share with your friends</span>{" "}
                        </a>
                      </p>
                    </div>
                    <div className="history-delete-button-ctm">
                      <a href="#" title="Delete">
                        <i className="fa-solid fa-trash"></i>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="inner-ctm-chat-with-astrologer">
                  <div className="inner-ctm-chat-with-astrologer-top">
                    <a href="#" title="Astrologer">
                      <div className="order-id-sec">
                        <ul>
                          <li>
                            <p>Order Id: #1732450779437</p>
                          </li>
                          <li className="help-list-button-ctm">
                            <button type="button" className="help-ctm-ctm">
                              HELP
                            </button>
                          </li>
                        </ul>
                      </div>
                      <div className="chat-astrologer-name-sec">
                        <h5>Shriniwas</h5>
                        <p>Vedic, Numerology, Vastu</p>
                      </div>
                      <div className="date-and-tine-sec">
                        <p>24 Nov 24, 05:49 PM</p>
                      </div>
                      <div className="chat-completed-content">
                        <p className="ctm-color-green">Completed </p>
                      </div>
                      <div className="call-rate-text">
                        <p>Rate: ₹ 20/min </p>
                      </div>
                      <div className="duration-history-text">
                        <p>Deduction: ₹ 140 </p>
                      </div>
                    </a>
                  </div>
                  <div className="inner-ctm-chat-with-astrologer-botton">
                    <div className="share-with-frnds-chat">
                      <p>
                        <a href="#" title="Share with your friends">
                          <img src="/what-sap-icon.webp" alt="whatsapp" />
                          <span>Share with your friends</span>{" "}
                        </a>
                      </p>
                    </div>
                    <div className="history-delete-button-ctm">
                      <a href="#" title="Delete">
                        <i className="fa-solid fa-trash"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="wallet-ctm-tab " data-id="wallet-ctm-tab3">
              <div className="ctm-chat-with-astrologer">
                <div className="inner-ctm-chat-with-astrologer">
                  <div className="inner-ctm-chat-with-astrologer-top">
                    <a href="#" title="Astrologer">
                      <div className="order-id-sec">
                        <ul>
                          <li>
                            <p>Order Id: #1732450779437</p>
                          </li>
                          <li className="help-list-button-ctm">
                            <button type="button" className="help-ctm-ctm">
                              HELP
                            </button>
                          </li>
                        </ul>
                      </div>
                      <div className="chat-astrologer-name-sec">
                        <h5>Shriniwas</h5>
                        <p>Vedic, Numerology, Vastu</p>
                      </div>
                      <div className="date-and-tine-sec">
                        <p>24 Nov 24, 05:49 PM</p>
                      </div>
                      <div className="chat-completed-content">
                        <p className="ctm-color-green">Completed </p>
                      </div>
                      <div className="call-rate-text">
                        <p>Rate: ₹ 20/min </p>
                      </div>
                      <div className="duration-history-text">
                        <p>Deduction: ₹ 140 </p>
                      </div>
                    </a>
                  </div>
                  <div className="inner-ctm-chat-with-astrologer-botton">
                    <div className="share-with-frnds-chat">
                      <p>
                        <a href="#" title="Share with your friends">
                          <img src="/what-sap-icon.webp" alt="whatsapp" />
                          <span>Share with your friends</span>{" "}
                        </a>
                      </p>
                    </div>
                    <div className="history-delete-button-ctm">
                      <a href="#" title="Delete">
                        <i className="fa-solid fa-trash"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="wallet-ctm-tab " data-id="wallet-ctm-tab4">
              <div className="ctm-chat-with-astrologer">
                <div className="inner-ctm-chat-with-astrologer">
                  <div className="inner-ctm-chat-with-astrologer-top">
                    <a href="#" title="Astrologer">
                      <div className="order-id-sec">
                        <ul>
                          <li>
                            <p>Order Id: #1732450779437</p>
                          </li>
                          <li className="help-list-button-ctm">
                            <button type="button" className="help-ctm-ctm">
                              HELP
                            </button>
                          </li>
                        </ul>
                      </div>
                      <div className="chat-astrologer-name-sec">
                        <h5>Shriniwas</h5>
                        <p>Vedic, Numerology, Vastu</p>
                      </div>
                      <div className="date-and-tine-sec">
                        <p>24 Nov 24, 05:49 PM</p>
                      </div>
                      <div className="chat-completed-content">
                        <p className="ctm-color-green">Completed </p>
                      </div>
                      <div className="call-rate-text">
                        <p>Rate: ₹ 20/min </p>
                      </div>
                      <div className="duration-history-text">
                        <p>Deduction: ₹ 140 </p>
                      </div>
                    </a>
                  </div>
                  <div className="inner-ctm-chat-with-astrologer-botton">
                    <div className="share-with-frnds-chat">
                      <p>
                        <a href="#" title="Share with your friends">
                          <img src="/what-sap-icon.webp" alt="whatsapp" />
                          <span>Share with your friends</span>{" "}
                        </a>
                      </p>
                    </div>
                    <div className="history-delete-button-ctm">
                      <a href="#" title="Delete">
                        <i className="fa-solid fa-trash"></i>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="inner-ctm-chat-with-astrologer">
                  <div className="inner-ctm-chat-with-astrologer-top">
                    <a href="#" title="Astrologer">
                      <div className="order-id-sec">
                        <ul>
                          <li>
                            <p>Order Id: #1732450779437</p>
                          </li>
                          <li className="help-list-button-ctm">
                            <button type="button" className="help-ctm-ctm">
                              HELP
                            </button>
                          </li>
                        </ul>
                      </div>
                      <div className="chat-astrologer-name-sec">
                        <h5>Shriniwas</h5>
                        <p>Vedic, Numerology, Vastu</p>
                      </div>
                      <div className="date-and-tine-sec">
                        <p>24 Nov 24, 05:49 PM</p>
                      </div>
                      <div className="chat-completed-content">
                        <p className="ctm-color-green">Completed </p>
                      </div>
                      <div className="call-rate-text">
                        <p>Rate: ₹ 20/min </p>
                      </div>
                      <div className="duration-history-text">
                        <p>Deduction: ₹ 140 </p>
                      </div>
                    </a>
                  </div>
                  <div className="inner-ctm-chat-with-astrologer-botton">
                    <div className="share-with-frnds-chat">
                      <p>
                        <a href="#" title="Share with your friends">
                          <img src="/what-sap-icon.webp" alt="whatsapp" />
                          <span>Share with your friends</span>{" "}
                        </a>
                      </p>
                    </div>
                    <div className="history-delete-button-ctm">
                      <a href="#" title="Delete">
                        <i className="fa-solid fa-trash"></i>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="inner-ctm-chat-with-astrologer">
                  <div className="inner-ctm-chat-with-astrologer-top">
                    <a href="#" title="Astrologer">
                      <div className="order-id-sec">
                        <ul>
                          <li>
                            <p>Order Id: #1732450779437</p>
                          </li>
                          <li className="help-list-button-ctm">
                            <button type="button" className="help-ctm-ctm">
                              HELP
                            </button>
                          </li>
                        </ul>
                      </div>
                      <div className="chat-astrologer-name-sec">
                        <h5>Shriniwas</h5>
                        <p>Vedic, Numerology, Vastu</p>
                      </div>
                      <div className="date-and-tine-sec">
                        <p>24 Nov 24, 05:49 PM</p>
                      </div>
                      <div className="chat-completed-content">
                        <p className="ctm-color-green">Completed </p>
                      </div>
                      <div className="call-rate-text">
                        <p>Rate: ₹ 20/min </p>
                      </div>
                      <div className="duration-history-text">
                        <p>Deduction: ₹ 140 </p>
                      </div>
                    </a>
                  </div>
                  <div className="inner-ctm-chat-with-astrologer-botton">
                    <div className="share-with-frnds-chat">
                      <p>
                        <a href="#" title="Share with your friends">
                          <img src="/what-sap-icon.webp" alt="whatsapp" />
                          <span>Share with your friends</span>{" "}
                        </a>
                      </p>
                    </div>
                    <div className="history-delete-button-ctm">
                      <a href="#" title="Delete">
                        <i className="fa-solid fa-trash"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReportHistory;
