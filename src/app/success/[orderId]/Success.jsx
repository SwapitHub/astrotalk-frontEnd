"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Success = () => {
  const params = useParams();
  const [orderDetailData, setOrderDetailData] = useState();
  console.log(orderDetailData);

  useEffect(() => {
    const handleOrderDetail = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}/shop-order-list-detail/${params?.orderId}`
        );
        console.log(response);

        setOrderDetailData(response.data.data);
      } catch (err) {
        console.log("product detail data is not found", err);
      }
    };
    handleOrderDetail();
  }, [params?.orderId]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="success-outer">
      <div className="container">
        <div className="success-inner">
          <div className="print-receipt">
            <button onClick={handlePrint}>Print Receipt</button>
          </div>
          <div className="success-top-content">
            <h2>Thank You for Your Order!</h2>
            <p>
              Your order has been successfully placed, and we’re thrilled to be
              part of your love story!
            </p>
            <div className="success-order-details">
              <h3>Order Details :</h3>
              <ul>
                <li>
                  <span>Order Number : {orderDetailData?.order_id}</span>
                </li>
                <li>
                  <span>
                    Order Date :{" "}
                    {new Date(orderDetailData?.createdAt).toLocaleString()}
                  </span>
                </li>
                <li>
                  <span>Mobile Number : {orderDetailData?.userMobile}</span>
                </li>
                {orderDetailData?.gemStone_product_price > 0 && (
                  <>
                    {orderDetailData?.ring_size && (
                      <li>
                        <span>
                          Gemstone Ring size : {orderDetailData?.ring_size}
                        </span>
                      </li>
                    )}
                  </>
                )}

                {orderDetailData?.addresses.length > 0 && (
                  <li>
                    <span>
                      Shipping To : : city-{" "}
                      {orderDetailData?.addresses[0]?.city}, state -{" "}
                      {orderDetailData?.addresses[0]?.state}
                    </span>
                  </li>
                )}
                {orderDetailData?.product_type_gem && (
                  <li>
                    <span>
                      {orderDetailData?.ring_size
                        ? "Gemstone Ring product price"
                        : "Gemstone Pendant product price"}{" "}
                      : ₹ {orderDetailData?.gemStone_product_price}
                    </span>
                  </li>
                )}
                <li>Product GST Amount : ₹ {orderDetailData?.gstAmount}</li>
                <li>
                  Product Amount : ₹{" "}
                  {Math.round(orderDetailData?.totalAmount) -
                    Math.round(orderDetailData?.gemStone_product_price)}
                </li>
                <li>
                  Total Amount : ₹{" "}
                  {Math.round(orderDetailData?.totalAmount) +
                    Math.round(orderDetailData?.gstAmount)}
                </li>
              </ul>
            </div>
          </div>
          <div className="success-img">
            <img
              src={orderDetailData?.productImg}
              alt={orderDetailData?.name}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Success;
