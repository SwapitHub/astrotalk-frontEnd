"use client";
import Link from 'next/link'
import React from 'react'

const Astrology = () => {
  return (
   <>
     {/* <!---- Astrology section start here---> */}
      <section className="section-spacing astrology_seciton">
        <div className="container">
          <div className="astro-inner">
            <div className="home-heading">
              <h2>Complimentary Astrology Services</h2>
            </div>
            <div className="row">
              <div className="col">
                <Link href="">
                  <div className="content-wrap">
                    <h3>Today's Horoscope</h3>
                    <p>
                      {" "}
                      Unsure about how your day will unfold? Get free Aries
                      horoscope online prediction from top astrologer. Read your
                      Aries Zodiac Sign Horoscope today!
                    </p>
                  </div>
                </Link>
              </div>
              <div className="col">
                <Link href="">
                  <div className="content-wrap">
                    <h3>Free Kundli</h3>
                    <p>
                      {" "}
                      Generate your free online kundli report from Astrotalk.
                      Our Kundli software can help you predict the future for
                      yourself by reading the birth chart.{" "}
                    </p>
                  </div>
                </Link>
              </div>

              <div className="col">
                <Link href="">
                  <div className="content-wrap">
                    <h3>Compatibility</h3>
                    <p>
                      {" "}
                      Confused by love? Remove the doubts & find the sparks!
                      Check the compatibility with your partner using our tool
                      and ignite a love that lasts forever.{" "}
                    </p>
                  </div>
                </Link>
              </div>
              <div className="col">
                <Link href="">
                  <div className="content-wrap">
                    <h3>Kundli Matching</h3>
                    <p>
                      {" "}
                      Check Love Compatibility and Marriage Prediction online at
                      Astrotalk. Get the best Horoscope and kundli matching
                      predictions today!{" "}
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
  )
}

export default Astrology