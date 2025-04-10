"use client"
import React, { useState } from "react";
import MyWallet from "./MyWallet";
import MyWalletPaymentLog from "./myWalletPaymentLog";

const MyWalletHome = () => {
    const [transactionBtn, setTransactionBtn] = useState("Wallet")
    
  return (
    <section className="my-wallet-sec-bg">
      <div className="container">
        <div className="wallet-transactions-tabs">
          <div className="my-wallet-sec-transactions-tabs">
            <div className="wallet-ctm-tab-menu">
              <ul>
                <li>
                  <button
                    className={`wallet-ctm-tab-a ${transactionBtn=="Wallet" && "wallet-ctm-active-a"} `}
                    onClick={()=>setTransactionBtn("Wallet")}
                  >
                    Wallet Transactions
                  </button>
                </li>
                <li>
                  <button
                    className={`wallet-ctm-tab-a ${transactionBtn=="PaymentLogs" && "wallet-ctm-active-a"}`}
                    onClick={()=>setTransactionBtn("PaymentLogs")}

                  >
                    Payment Logs
                  </button>
                </li>
              </ul>
            </div>
            {transactionBtn=="Wallet" &&
                <MyWallet/>               
            }
            {
                 transactionBtn == "PaymentLogs" && 
                 <MyWalletPaymentLog/>
            }
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyWalletHome;
