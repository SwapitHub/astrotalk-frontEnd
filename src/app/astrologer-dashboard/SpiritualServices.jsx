import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const SpiritualServices = () => {
  const [servicesData, setServicesData] = useState([]);
  const [astrologerPhone, setAstrologerPhone] = useState("");

  useEffect(() => {
    const phoneFromCookie = Cookies.get("astrologer-phone");
    setAstrologerPhone(phoneFromCookie);
  }, []);

  useEffect(() => {
    const handleGetServices = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}/get-add-AdminServices-astrologer`
        );
        setServicesData(response.data);
      } catch (err) {
        console.log("services get api err", err);
      }
    };
    handleGetServices();
  }, []);

  const handleSubmit = async () => {
    const selectedServices = [];

    servicesData.forEach((item) => {
      const checkbox = document.getElementById(`service-${item._id}`);
      const priceInput = document.getElementById(`price-${item._id}`);

      if (checkbox?.checked && priceInput?.value) {
        selectedServices.push({
          service: item.AdminServices,
          service_price: priceInput.value,
        });
      }
    });

    // ✅ Show error only if nothing valid is selected
    if (selectedServices.length === 0) {
      toast.error("Please select at least one service with a price", {
        position: "top-right",
      });
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/update-spiritual-service`,
        {
          mobileNumber: astrologerPhone,
          spiritual_services: selectedServices,
        }
      );
      if (response.status == 200) {
        toast.success("Added Spiritual Services SuccessFully", {
          position: "top-right",
        });

        servicesData.forEach((item) => {
          const checkbox = document.getElementById(`service-${item._id}`);
          const priceInput = document.getElementById(`price-${item._id}`);

          if (checkbox) checkbox.checked = false;
          if (priceInput) priceInput.value = "";
        });
      }
    } catch (error) {
      console.error("PATCH error:", error);
      //   alert("Something went wrong while updating.");
    }
  };

  return (
    <div className="spiritual-services-outer">
        <h1>Spiritual Services</h1>
      <div className="spiritual-head-sec">
        <div className="spiritual-head-left">
          <h2> Services</h2>
        </div>
        <div className="spiritual-head-right">
          <h2>Price</h2>
        </div>
      </div>

      {servicesData?.map((item) => (
        <div className="single-service" key={item._id}>
          <div className="single-service-left">
            <input type="checkbox" id={`service-${item._id}`} />
            <label htmlFor={`service-${item._id}`}>{item.AdminServices}</label>
          </div>
          <div className="single-service-right">
            <input
              type="number"
              id={`price-${item._id}`}
              placeholder="Enter price"
              min="0"
            />
          </div>
        </div>
      ))}

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default SpiritualServices;
