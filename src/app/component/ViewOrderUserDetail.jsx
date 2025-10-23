import Image from "next/image";
import React from "react";

const ViewOrderUserDetail = ({ editDetailOrder, setShowOrderViewPopUp }) => {
  const address = editDetailOrder?.addresses?.[0] || {};
  console.log(address);

  const addressFields = [
    "name",
    "mobile",
    "altMobile",
    "email",
    "flat",
    "locality",
    "landmark",
    "city",
    "state",
    "country",
    "pin",
  ];

  const orderFields = [
    { label: "Order ID", value: editDetailOrder?.order_id },
    { label: "Payment ID", value: editDetailOrder?.payment_id },
    { label: "User Name", value: editDetailOrder?.userName },
    { label: "User Mobile", value: editDetailOrder?.userMobile },
    { label: "Astrologer Mobile", value: editDetailOrder?.astrologerPhone },


    { label: "Product Name", value: editDetailOrder?.productName },
    { label: "Product Type", value: editDetailOrder?.productType },
    { label: "Ring Size", value: editDetailOrder?.ring_size },
    { label: "Gemstone Type", value: editDetailOrder?.product_type_gem },
    { label: "Gemstone Price", value: editDetailOrder?.gemStone_product_price },
    { label: "Total Amount", value: `₹ ${editDetailOrder?.totalAmount}` },
    { label: "GST Amount", value: `₹ ${editDetailOrder?.gstAmount}` },
    {
      label: "Admin Commission",
      value: `₹ ${editDetailOrder?.adminCommission}`,
    },
    { label: "Currency", value: editDetailOrder?.currency },
    {
      label: "Order Status",
      value: editDetailOrder?.product_order_status ? "Ordered" : "Not Ordered",
    },
    {
      label: "Cancelled",
      value: editDetailOrder?.product_cancel_order ? "Yes" : "No",
    },
    {
      label: "Cancel Reason",
      value: editDetailOrder?.product_cancel_order_reason || "-",
    },
    {
      label: "Order Completed",
      value: editDetailOrder?.product_order_complete ? "Yes" : "No",
    },
    { label: "User Status", value: editDetailOrder?.status },
    {
      label: "Created At",
      value: new Date(editDetailOrder?.createdAt).toLocaleString(),
    },
    {
      label: "Updated At",
      value: new Date(editDetailOrder?.updatedAt).toLocaleString(),
    },
  ];

  return (
    <main
      className="Edit-Order-User-detail"
    >
      <span
        className="close"
        onClick={() => setShowOrderViewPopUp(false)}
      
      >
        ×
      </span>

      <h1 className="common-h1-heading" >
        User Order Detail
      </h1>

      {/* Address Section */}
      {Object.keys(address).length > 0 && (
        <div className="user-address">
          <h2>
            Shipping Address
          </h2>
          <div className="profile-table">
            {addressFields.map((field) => (
              <div
                key={field}
                className="common-profile"
              >
                <div
                  className="name"
                >
                  {field.replace(/([A-Z])/g, " $1").trim()}:
                </div>
                <div className="value">
                  {address[field] || "-"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Order/Product Section */}
      <h2>
        Product / Order Details
      </h2>
      <div className="profile-table">
        {orderFields.map(({ label, value }) => (
          <div
            key={label}
            className="common-profile"
           
          >
            <div className="name">
              {label}:
            </div>
            <div className="value">
              {value || "-"}
            </div>
          </div>
        ))}
      </div>

      {/* Product Image (if available) */}
      {editDetailOrder?.productImg && (
        <div className="common-profile"> 
        <div className="name">
          Product Image
          </div>
           <div className="value">
          <Image
            width={100}
            height={100}
            src={
              editDetailOrder.productImg
                ? process.env.NEXT_PUBLIC_WEBSITE_URL +
                  editDetailOrder.productImg
                : "/user-icon-image.png"
            }
            alt="product"
          />
          </div>
        </div>
      )}
    </main>
  );
};

export default ViewOrderUserDetail;
