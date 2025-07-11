// "use client";
// import Loader from "@/app/component/Loader";
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import secureLocalStorage from "react-secure-storage";
// import { toast } from "react-toastify";

// const AddSpiritualServices = () => {
//   const [chatServices, setChatServices] = useState([]);
//   const [disableButton, setDisableButton] = useState();
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchChatServices();

//     const storedStatus = secureLocalStorage.getItem("buttonStatus");
//     setDisableButton(storedStatus === "true"); 
//   }, []);

//   const handleSubmitAddAdminServices = async () => {
//     const AdminServices = document
//       .getElementById("AdminServices")
//       ?.value.trim();

//     if (!AdminServices) {
//       toast.warning("Please enter a AdminServices!", {
//         position: "top-right",
//       });
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `${process.env.NEXT_PUBLIC_WEBSITE_URL}/post-add-AdminServices-astrologer`,
//         { AdminServices: AdminServices }
//       );

//       if (response.data.message === "success") {
//         toast.success("AdminServices added successfully!", {
//           position: "top-right",
//         });
//         document.getElementById("AdminServices").value = "";
//         fetchChatServices();
//         setDisableButton(secureLocalStorage.setItem("buttonStatus", "true"));
//         setDisableButton(true);
//       }
//     } catch (error) {
//       console.error("Add AdminServices error:", error);
//       toast.error("Failed to add AdminServices", { position: "top-right" });
//     }
//   };

//   const fetchChatServices = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(
//         `${process.env.NEXT_PUBLIC_WEBSITE_URL}/get-add-AdminServices-astrologer`
//       );
//       setChatServices(response.data); // Assuming it's a plain array
//     } catch (error) {
//       console.error("Fetch AdminServices list error:", error);
//       toast.error("Failed to fetch AdminServices!", {
//         position: "top-right",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteAdminServices = async (id) => {
//     try {
//       const res = await axios.delete(
//         `${process.env.NEXT_PUBLIC_WEBSITE_URL}/delete-AdminServices-astrologer/${id}`
//       );
//       if (res.data.message === "success") {
//         toast.success("AdminServices removed successfully!", {
//           position: "top-right",
//         });
//         fetchChatServices();
//         secureLocalStorage.removeItem("buttonStatus");
//         setDisableButton(false);
//       }
//     } catch (err) {
//       console.error("Delete AdminServices error:", err);
//       toast.error("Failed to delete AdminServices!", {
//         position: "top-right",
//       });
//     }
//   };

//   useEffect(() => {
//     fetchChatServices();
//   }, []);

//   return (
//     <div className="AddAdminServices AddLanguage">
//       <div className="language-add-data">
//         <h2>Add Spiritual Services</h2>
//         <input
//           type="text"
//           placeholder="Spiritual Services"
//           id="AdminServices"
//         />
//         <button
//           onClick={handleSubmitAddAdminServices}
//         >
//          Add SpiritualServices
//         </button>
//       </div>

//       <div className="language-list">
//         <h2>Spiritual Services</h2>
//         {loading ? (
//            <Loader/>
//         ) : (
//           <ul>
//             {chatServices.map((item) => (
//               <li key={item._id}>
//                 {item.AdminServices} 
//                 <button onClick={() => deleteAdminServices(item._id)}>
//                   Remove
//                 </button>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AddSpiritualServices;
