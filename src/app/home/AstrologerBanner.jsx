import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react'
import { PiChatCircleDotsLight, PiHandsPrayingThin, PiPhoneCallLight, PiShoppingCartLight } from 'react-icons/pi';

const AstrologerBanner = () => {
  const router = useRouter();

  return (
    <section className="section-spacing four-col">
      <div className="container">
        <div className="row">

          <Link href="/shop">
            <div className="col">
              <div className="icon">
                <PiShoppingCartLight />
              </div>
              <div className="col-text">
                <h3> Shop</h3>
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
                <PiHandsPrayingThin />
              </div>
              <div className="col-text">
                <h3>Book a Pooja Online</h3>
              </div>
            </div>
          </Link>
          <Link href="/chat-with-astrologer">
            <div className="col">
              <div className="icon">
                <PiChatCircleDotsLight />
              </div>
              <div className="col-text">
                <h3>Chat with an Astrologer</h3>
              </div>
            </div>
          </Link>
          {/* <Link href="/talk-to-astrologer">
            <div className="col">
              <div className="icon">
                <PiPhoneCallLight />
              </div>
              <div className="col-text">
                <h3>Talk to an Astrologer</h3>
              </div>
            </div>
          </Link> */}
        </div>
      </div>
    </section>

  )
}

export default AstrologerBanner