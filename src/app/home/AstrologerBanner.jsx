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
            <Link href="/chat-with-astrologer">
              <div className="col">
                <div className="icon">
                  <PiChatCircleDotsLight />
                </div>
                <div className="col-text">
                  <h3>Chat with Astrologer</h3>
                </div>
              </div>
            </Link>
            <Link href="/talk-to-astrologer">
              <div className="col">
                <div className="icon">
                  <PiPhoneCallLight />
                </div>
                <div className="col-text">
                  <h3>Talk to Astrologer</h3>
                </div>
              </div>
            </Link>
            <Link href="/shop">
              <div className="col">
                <div className="icon">
                  <PiShoppingCartLight />
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
                  <PiHandsPrayingThin />
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