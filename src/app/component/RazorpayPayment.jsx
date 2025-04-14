"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRazorpay } from "react-razorpay";
import { toast } from "react-toastify";
import secureLocalStorage from "react-secure-storage";

const RazorpayPayment = ({ totalFinalPrice, extraAmount,totalAmount }) => {
  const { error, isLoading, Razorpay } = useRazorpay();
  const userMobile = secureLocalStorage.getItem("userMobile");

  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);

      // Create order on the server
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/create-order`,
        {
          amount: totalFinalPrice,
          extraAmount: extraAmount,
          totalAmount: totalAmount,
          currency: "INR",
          userMobile: Math.round(userMobile),
        }
      );

      const options = {
        key: "rzp_test_Y7VuzH5OqFVf3Q",
        amount: data.amount,
        currency: data.currency,
        name: "Test Company",
        description: "Test Transaction",
        order_id: data.id,
        handler: async function (response) {
          try {
            // Verify payment on the backend
            const verifyRes = await axios.post(
              `${process.env.NEXT_PUBLIC_WEBSITE_URL}/verify-payment`,
              response
            );

            if (verifyRes.data.success) {
              toast.success(
                "Payment successful! Thank you for your purchase.",
                {
                  position: "top-right",
                }
              );
              // Additional success logic here
            } else {
              // Delete the order record if verification fails
              await axios.post(
                `${process.env.NEXT_PUBLIC_WEBSITE_URL}/cancel-order`,
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

export default RazorpayPayment;
