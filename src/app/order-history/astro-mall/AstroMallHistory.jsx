import Link from "next/link";
import React from "react";

const AstroMallHistory = () => {
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
                <li>
                  <Link href="/order-history/chat" className="wallet-ctm-tab-a">
                    Chat
                  </Link>
                </li>
                {/* <li>
                  <Link
                    href="/order-history/report"
                    className="wallet-ctm-tab-a"
                  >
                    Report
                  </Link>
                </li> */}
                <li>
                  <Link
                    href="/order-history/astro-mall"
                    className="wallet-ctm-tab-a wallet-ctm-active-a"
                  >
                    Astromall
                  </Link>
                </li>
              </ul>
            </div>

            
          </div>
        </div>
      </div>
    </section>
  );
};

export default AstroMallHistory;
