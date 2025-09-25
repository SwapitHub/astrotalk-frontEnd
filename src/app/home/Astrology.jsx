"use client";
import Link from "next/link";
import React from "react";

const Astrology = () => {
  return (
    <>
      {/* <!---- Astrology section start here---> */}
      <section className="section-spacing astrology_seciton">
        <div className="container">
          <div className="astro-inner">
            <div className="home-heading">
              <h2>Our Astrology Services</h2>
            </div>
            <div className="row">
              <div className="col">
                <Link
                  href="https://weddingbyte.com/daily-horoscope"
                  target="_blank"
                >
                  <div className="content-wrap">
                    <h3>Daily Zodiac Insights</h3>
                    <p>
                      {" "}
                      Get free daily predictions covering love, career, health, and opportunities.

                    </p>
                  </div>
                </Link>
              </div>
              <div className="col">
                <Link href="https://weddingbyte.com/kundli" target="_blank">
                  <div className="content-wrap">
                    <h3>Personalized Birth Chart (Kundli) Report</h3>
                    <p>
                      {" "}
                      Create your free Kundli in seconds and gain clarity about your future.{" "}
                    </p>
                  </div>
                </Link>
              </div>

              <div className="col">
                <Link href="https://weddingbyte.com/e-invites" target="_blank">
                  <div className="content-wrap">
                    <h3>Digital Invitation Cards</h3>
                    <p>
                      {" "}
                      Stylish, eco-friendly e-invites ,  easy to design, share, and customize.{" "}
                    </p>
                  </div>
                </Link>
              </div>
              <div className="col">
                <Link
                  href="https://weddingbyte.com/kundli-matching"
                  target="_blank"
                >
                  <div className="content-wrap">
                    <h3>Compatibility & Match Making</h3>
                    <p>
                      {" "}
                     Check love and marriage compatibility through detailed horoscope matching.{" "}
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!---- Astrology section end here---> */}

      {/* <!---- Counter section start here---> */}
      <section className="counter_seciton">
        <div className="container">
          <div className="row">
            <div className="col">
              <h3>45,835+</h3>
              <p>Total Astrologers</p>
            </div>
            <div className="col">
              <h3>1326 Million Minutes</h3>
              <p>Total Chat/Call minutes</p>
            </div>
            <div className="col">
              <h3>99.5 Million</h3>
              <p>Total Customers</p>
            </div>
          </div>
        </div>
      </section>
      {/* <!---- Counter section End here---> */}
    </>
  );
};

export default Astrology;
