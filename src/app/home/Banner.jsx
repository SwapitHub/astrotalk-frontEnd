import Link from "next/link";
import React from "react";
import { FaRocketchat } from "react-icons/fa";
import { IoCallOutline } from "react-icons/io5";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { LiaPlaceOfWorshipSolid } from "react-icons/lia";
import { useRouter } from "next/navigation";

const Banner = () => {
  const router = useRouter();

  return (
    <>
      {/* <!---- Banner Section Start ---> */}

     
        <section className="banner">
          <div className="container">
            <div className="row">
              <div className="left-col">
                <h1>200+ Celebs recommend Astrotalk</h1>
                <h2>Chat With Astrologer</h2>
                <div className="btn-wrapper">
                  <Link href="/chat-with-astrologer" className="btn">
                    chat now
                  </Link>
                </div>
              </div>
              <div className="right-col">
                <img src="/blue-circle.png" />
              </div>
            </div>
          </div>
        </section>
     

      {/* <!---- Banner Section End here---> */}

      {/* <!---- Four Col Section start here---> */}
      <section className="section-spacing four-col">
        <div className="container">
          <div className="row">
            <Link href="/chat-with-astrologer">
              <div className="col">
                <div className="icon">
                  <FaRocketchat />
                </div>
                <div className="col-text">
                  <h3>Chat with Astrologer</h3>
                </div>
              </div>
            </Link>
            <Link href="/talk-to-astrologer">
              <div className="col">
                <div className="icon">
                  <IoCallOutline />
                </div>
                <div className="col-text">
                  <h3>Talk to Astrologer</h3>
                </div>
              </div>
            </Link>
            <Link href="/shop">
              <div className="col">
                <div className="icon">
                  <HiOutlineShoppingBag />
                </div>
                <div className="col-text">
                  <h3>Astromall Shop</h3>
                </div>
              </div>
            </Link>
            <Link
              onClick={(e) => {
                e.preventDefault();
                router.push("/shop");
              }}
              href="/e-shop"
            >
              <div className="col">
                <div className="icon">
                  <LiaPlaceOfWorshipSolid />
                </div>
                <div className="col-text">
                  <h3> Book A Pooja</h3>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
      {/* <!---- Four Col Section end here---> */}
    </>
  );
};

export default Banner;
