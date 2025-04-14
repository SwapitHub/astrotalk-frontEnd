// "use client";
// import axios from "axios";
// import Link from "next/link";
// import React, { useEffect, useState } from "react";

// const MyWalletPaymentLog = ()  => {
//   const userPhone = Math.round(localStorage.getItem("userMobile"));
//   const [userData, setUserData] = useState();
// console.log(userPhone);

// useEffect(() => {
//   const fetchOrderUserList = async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.NEXT_PUBLIC_WEBSITE_URL}/create-order-user-list/${userPhone}`
//       );
//       console.log(response);
//       setUserData(response.data);
//     } catch (error) {
//       console.log("Error login detail api", error);
//     }
//   };

//   fetchOrderUserList();
// }, [userPhone]);

//   return (
//     <div
//       className="wallet-ctm-tab wallet-ctm-tab-active"
//       data-id="wallet-ctm-tab1"
//     >
//       <div className="my-wallet-sec-heading-content">
//         <h1 className="common-h1-heading">Transactions</h1>
//       </div>
//       <div className="inner-my-wallet-sec ctm-flex-row ctm-justify-content-between">
//         <div className="my-wallet-sec-left-content ctm-align-items-center ctm-flex-row">
//           <div className="my-walleavailable-balance-text">
//             <p>
//               {/* Available balance: <span>₹ {userData?.totalAmount}</span> */}
//             </p>
//           </div>
//           <div className="recharge-btm">
//             <Link
//               href="/add-wallet-money/price-list"
//               title="Recharge"
//               className="my-wallet-recharge-button"
//             >
//               Recharge
//             </Link>
//           </div>
//         </div>
//         <div className="my-wallet-sec-right-content">
//           <div className="inner-talk-to-astrologer-right-content">
//             <div className="my-wallet-recharge-btm delate-all-btn">
//               <a
//                 href="#"
//                 title="Delete All"
//                 className="my-wallet-recharge-button"
//               >
//                 Delete All
//               </a>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="my-wallet-table-sec">
//         <table>
//           <thead>
//             <tr>
//               <th>Recharge</th>
//               <th>	Datetime</th>
//               <th>Amount</th>
//               <th>Transaction ID</th>
//               <th>Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {userData?.map((item) => {
//               return (
//                 <>
//                   <tr>
//                     <td>Recharge</td>
//                     <td>
//                      {new Date(item?.createdAt)?.toLocaleString()}
//                     </td>
//                     <td>                      
//                         {item?.amount}                      
//                     </td>
//                     <td>{item?.order_id}</td>
//                     <td>{item?.status}</td>
//                     <td className="delete-button-icon">
//                       <a href="#" title="Remove">
//                         <i className="fa-solid fa-trash"></i>
//                       </a>
//                     </td>
//                   </tr>
//                 </>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default MyWalletPaymentLog;
