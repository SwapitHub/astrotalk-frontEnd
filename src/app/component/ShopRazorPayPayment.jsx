"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRazorpay } from "react-razorpay";
import { toast } from "react-toastify";
import secureLocalStorage from "react-secure-storage";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useEffect } from "react";

const ShopRazorPayPayment = ({
  totalFinalPrice,
  extraAmount,
  totalAmount,
  astrologerName,
  astrologerPhone,
  productType,
  addressDetailData,
  productDetailData,
  totalGstPrice,
  adminCommission,
}) => {
  const { error, isLoading, Razorpay } = useRazorpay();

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userMobile, setUserMobile] = useState(false);

  useEffect(() => {
    const userMobiles = Math.round(Cookies.get("userMobile"));
    setUserMobile(userMobiles);
  }, []);

  const handlePayment = async () => {
    try {
      setLoading(true);

      const addressToSend = {
        name: addressDetailData?.name,
        mobile: addressDetailData?.mobile,
        altMobile: addressDetailData?.altMobile,
        email: addressDetailData?.email,
        flat: addressDetailData?.flat,
        locality: addressDetailData?.locality,
        city: addressDetailData?.city,
        state: addressDetailData?.state,
        country: addressDetailData?.country,
        pin: addressDetailData?.pin,
        landmark: addressDetailData?.landmark,
      };
      const address = addressDetailData ? addressToSend : "";

      // Create order on the server
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/create-order-shop`,
        {
          amount: totalFinalPrice,
          extraAmount: extraAmount,
          totalAmount: totalAmount,
          currency: "INR",
          userMobile: Math.round(userMobile),
          astrologerName,
          astrologerPhone,
          productName: productDetailData?.name,
          productType,
          productImg: productDetailData?.astroMallProductImg,
          address,
        }
      );
      console.log(data, "data=====");

      const options = {
        key: "rzp_test_Y7VuzH5OqFVf3Q",
        amount: data.amount,
        currency: data.currency,
        name: "Test Company",
        description: "Test Transaction",
        order_id: data.id,
        handler: async function (response) {
          console.log(response, "response");

          try {
            // Verify payment on the backend
            const verifyRes = await axios.post(
              `${process.env.NEXT_PUBLIC_WEBSITE_URL}/verify-payment-shop`,
              response
            );

            if (verifyRes.data.success) {
              const res = await axios.put(
                `${process.env.NEXT_PUBLIC_WEBSITE_URL}/update-any-field-payment-shop/${response?.razorpay_order_id}`,
                {
                  ring_size: productDetailData?.ring_size || "",
                  gemStone_product_price:
                    productDetailData?.gemStone_product_price || 0,
                  gstAmount: totalGstPrice,
                  adminCommission,
                }
              );
              if (res?.status == 200) {
                router.push(`/success/${response?.razorpay_order_id}`);
              }
              console.log("Update Response:", res);
              console.log("Razorpay Response:", response);
            } else {
              // Delete the order record if verification fails
              await axios.post(
                `${process.env.NEXT_PUBLIC_WEBSITE_URL}/cancel-order-shop`,
                {
                  order_id: data.id,
                }
              );

              toast.error(
                "Payment verification failed. Please contact support.",
                {
                  position: "top-right",
                }
              );
            }
          } catch (err) {
            console.error("Verification Error:", err);
            toast.error(
              "An error occurred during verification. Please try again.",
              {
                position: "top-right",
              }
            );
          }
        },
        prefill: {
          email: "test@example.com",
          contact: userMobile || "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp1 = new Razorpay(options);

      rzp1.on("payment.failed", async function (response) {
        try {
          // Delete the failed order record
          await axios.post(
            `${process.env.NEXT_PUBLIC_WEBSITE_URL}/cancel-order`,
            {
              order_id: data.id,
              error: response.error,
            }
          );

          toast.error(`Payment failed: ${response.error.description}`, {
            position: "top-right",
          });
        } catch (error) {
          console.error("Failed to cancel order:", error);
        }
      });

      rzp1.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(
        "An error occurred while processing your payment. Please try again.",
        {
          position: "top-right",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handlePayment} disabled={loading}>
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
};

export default ShopRazorPayPayment;
