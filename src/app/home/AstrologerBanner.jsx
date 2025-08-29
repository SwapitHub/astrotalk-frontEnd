import Link from 'next/link';
import React from 'react'
import { FaRocketchat } from 'react-icons/fa';
import { HiOutlineShoppingBag } from 'react-icons/hi';
import { IoCallOutline } from 'react-icons/io5';
import { LiaPlaceOfWorshipSolid } from 'react-icons/lia';

const AstrologerBanner = () => {
  return (
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

  )
}

export default AstrologerBanner