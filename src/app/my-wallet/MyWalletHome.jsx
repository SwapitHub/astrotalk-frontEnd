"use client";
import React, { useState } from "react";
import MyWallet from "./MyWallet";
import MyWalletPaymentLog from "./MyWalletPaymentLog";
import MyWalletAstroPuja from "./MyWalletAstroPuja";
import MyWalletAstroProduct from "./MyWalletAstroProduct";
// import MyWalletPaymentLog from "./myWalletPaymentLog";

const MyWalletHome = () => {
  const [transactionBtn, setTransactionBtn] = useState("Wallet");

  return (
    <section className="my-wallet-sec-bg">
      <div className="container">
        <div className="wallet-transactions-tabs">
          <div className="my-wallet-sec-transactions-tabs">
            <div className="wallet-ctm-tab-menu">
              <ul>
                <li>
                  <button
                    className={`wallet-ctm-tab-a ${
                      transactionBtn == "Wallet" && "wallet-ctm-active-a"
                    } `}
                    onClick={() => setTransactionBtn("Wallet")}
                  >
                    Wallet Transactions
                  </button>
                </li>
                <li>
                  <button
                    className={`wallet-ctm-tab-a ${
                      transactionBtn == "PaymentLogs" && "wallet-ctm-active-a"
                    }`}
                    onClick={() => setTransactionBtn("PaymentLogs")}
                  >
                    Payment Logs
                  </button>
                </li>

                <li>
                  <button
                    className={`wallet-ctm-tab-a ${
                      transactionBtn == "WalletAstroMall" &&
                      "wallet-ctm-active-a"
                    }`}
                    onClick={() => setTransactionBtn("WalletAstroMall")}
                  >
                    Wallet Transaction Astro Puja
                  </button>
                </li>

                 <li>
                  <button
                    className={`wallet-ctm-tab-a ${
                      transactionBtn == "WalletAstroProduct" &&
                      "wallet-ctm-active-a"
                    }`}
                    onClick={() => setTransactionBtn("WalletAstroProduct")}
                  >
                    Wallet Transaction Astro Product
                  </button>
                </li>
              </ul>
            </div>
            {transactionBtn == "Wallet" && <MyWallet />}
            {transactionBtn == "PaymentLogs" && <MyWalletPaymentLog />}
            {transactionBtn == "WalletAstroMall" && <MyWalletAstroPuja />}
            {transactionBtn == "WalletAstroProduct" && <MyWalletAstroProduct />}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyWalletHome;
