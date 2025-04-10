"use client";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { validateAstrologerForm } from "../component/FormValidation";

const AstrologerRegistration = () => {
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
console.log(errors);

  const handleSubmitSignup = async () => {
    const validationErrors = validateAstrologerForm('astrologer');
    console.log(validationErrors);
    
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const formData = {
      first_name: document.getElementById("fname").value,
      date_of_birth: document.getElementById("birthday").value,
      gender: document.querySelector('input[name="gender"]:checked')?.value,
      languages: document.getElementById("language").value,
      skills: document.getElementById("Skills")?.value || "",
      deviceUse: document.getElementById("deviceUse").value,
      email: document.getElementById("emails").value,
      mobileNumber: document.getElementById("mobileNumber").value,
    };

    if (
      !formData.first_name ||
      !formData.date_of_birth ||
      !formData.languages ||
      !formData.skills ||
      !formData.deviceUse ||
      !formData.email ||
      !formData.mobileNumber
    ) {
      console.warn("All form fields are required.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/astrologer-registration`,
        {
          name: formData.first_name,
          dateOfBirth: formData.date_of_birth,
          gender: formData.gender,
          languages: formData.languages,
          skills: formData.skills,
          deviceUse: formData.deviceUse,
          email: formData.email,
          mobileNumber: formData.mobileNumber,
          astroStatus: false,
        }
      );
      if (response.data.message === "success") {
        document.getElementById("fname").value = "";
        document.getElementById("birthday").value = "";
        document.getElementById("emails").value = "";
        document.getElementById("mobileNumber").value = "";
        document.querySelectorAll('input[name="gender"]').forEach((radio) => {
          radio.checked = false;
        });
        setSuccessMessage(response.data.message);
        console.log("Form reset successfully.");
      }

      console.log("Registration successful:", response.data);
    } catch (error) {
      toast.error("Email or mobile number already registered", {
        position: "top-right",
      });
      console.log("Error in registration api");
    }
  };
  return (
    <>
      {successMessage == "success" ? (
        <div className="container">
          <section className="astrologer-registration-bg">
            <div className="container">
              <div className="inner-astrologer-registration">
                <div className="registration-heading">
                  <h1 className="common-h1-heading">Astrologer Registration</h1>
                </div>

                <div className="logo-astrologer-registration">
                  <a href="#" title="weddingbyte">
                    <img src="./wedding-fav-icon.ico" alt="weddingbyte" />
                  </a>
                </div>
              </div>
              <div className="astrologer-thanks-section-bg">
                <div className="inner-thanks-section">
                  <img src="./thanku-img.png" alt="Thank You" />
                </div>
                <div className="thanks-section-content">
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Maxime esse obcaecati amet beatae,
                  </p>
                  <p>
                    Lorem ipsam repudiandae suscipit eveniet voluptates porro.
                    Accusamus eius at praesentium libero neque deleniti amet
                    temporibus ex commodi illo,
                  </p>
                  <p>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    alias in consequuntur
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <section className="astrologer-registration-bg">
          <div className="container">
            <div className="inner-astrologer-registration">
              <div className="registration-heading">
                <h1 className="common-h1-heading">Astrologer Registration</h1>
              </div>
              <div className="logo-astrologer-registration">
                <a href="#" title="weddingbyte">
                  <img src="./wedding-fav-icon.ico" alt="weddingbyte" />
                </a>
              </div>
            </div>
            <div className="astrologer-registration-form">
              <form action="">
                <div className="form-filed-section-bg">
                  <div className="inner-form-filed-sec">
                    <div className="label-content">
                      <label for="Name">
                        Name <span>(नाम)</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      id="fname"
                      name="fname"
                      className="common-input-filed"
                      placeholder="Please enter your name here"
                    />
                    {errors.firstName && (
                      <p className="error">{errors.firstName}</p>
                    )}
                  </div>
                  <div className="inner-form-filed-sec">
                    <div className="label-content">
                      <label for="birthday">
                        Date of Birth <span>(जन्मतिथि)</span>
                      </label>
                    </div>
                    <div className="man-input-filed-sec">
                      <input
                        type="date"
                        id="birthday"
                        name="birthday"
                        className="common-input-filed"
                        placeholder="Please enter your date of birth"
                      />
                      {errors.dateOfBirth && (
                        <p className="error">{errors.dateOfBirth}</p>
                      )}
                    </div>
                  </div>
                  <div className="inner-form-filed-sec">
                    <div className="label-content">
                      <label htmlFor="gender">
                        Gender <span>(लिंग)</span>
                      </label>
                    </div>
                    <div className="man-input-filed-sec input-gender-sec common-input-filed">
                      <input
                        type="radio"
                        id="Male"
                        name="gender"
                        value="Male"
                      />
                      <label htmlFor="Male">Male</label>

                      <input
                        type="radio"
                        id="Female"
                        name="gender"
                        value="Female"
                      />
                      <label htmlFor="Female">Female</label>

                      <input
                        type="radio"
                        id="Other"
                        name="gender"
                        value="Other"
                      />
                      <label htmlFor="Other">Other</label>
                      {errors.gender && (
                        <p className="error">{errors.gender}</p>
                      )}
                    </div>
                  </div>

                  <div className="inner-form-filed-sec">
                    <div className="label-content">
                      <label for="Languages">
                        Languages <span>(भाषाएँ)</span>
                      </label>
                    </div>
                    <div className="man-input-filed-sec">
                      <select
                        name="language"
                        id="language"
                        className="common-input-filed"
                      >
                        <option value="select language">
                          Please select language
                        </option>
                        <option value="English">English</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Bengali">Bengali</option>
                        <option value="Assamese">Assamese</option>
                      </select>
                      {errors.languages && (
                        <p className="error">{errors.languages}</p>
                      )}
                    </div>
                  </div>

                  <div className="inner-form-filed-sec">
                    <div className="label-content">
                      <label for="Skills">
                        Skills <span>(कौशल)</span>
                      </label>
                    </div>
                    <div className="man-input-filed-sec">
                      <select
                        name="Skills"
                        id="Skills"
                        className="common-input-filed"
                      >
                        <option value="Please Select Option">
                          Please Select Option
                        </option>
                        <option value="Love and Relationship">
                          Love and Relationship
                        </option>
                        <option value="Marriage Consultant">
                          Marriage Consultant
                        </option>
                        <option value="Career Consultant">
                          Career Consultant
                        </option>
                        <option value="Finance Consultant">
                          Finance Consultant
                        </option>
                      </select>
                      {errors.skills && (
                        <p className="error">{errors.skills}</p>
                      )}
                    </div>
                  </div>

                  <div className="inner-form-filed-sec">
                    <div className="label-content">
                      <label for="use-phone">
                        Which phone do you use?{" "}
                        <span>(आप कौन सा फ़ोन इस्तेमाल करते हैं?)</span>
                      </label>
                    </div>
                    <div className="man-input-filed-sec common-input-filed">
                      <select
                        name="deviceUse"
                        id="deviceUse"
                        className="common-input-filed"
                      >
                        <option value="select device">
                          Please select device
                        </option>
                        <option value="Iphone">Iphone</option>
                        <option value="Android">Android</option>
                      </select>
                      {errors.deviceUse && (
                        <p className="error">{errors.deviceUse}</p>
                      )}
                    </div>
                  </div>

                  <div className="inner-form-filed-sec">
                    <div className="label-content">
                      <label for="birthday">
                        Email Address <span> (मेल पता)</span>
                      </label>
                    </div>
                    <div className="man-input-filed-sec">
                      <input
                        type="email"
                        id="emails"
                        name="emails"
                        multiple
                        className="common-input-filed"
                        placeholder="Enter your email here"
                        required
                      />
                      {errors.email && <p className="error">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="inner-form-filed-sec">
                    <div className="label-content">
                      <label for="birthday">
                        Mobile Number <span>मोबाइल नंबर</span>
                      </label>
                    </div>
                    <div className="man-input-filed-sec">
                      <input
                        type="text"
                        placeholder="Enter phone number"
                        id="mobileNumber"
                        name="quantity"
                        onInput={(e) => {
                          e.target.value = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 10);
                        }}
                        className="common-input-filed"
                      />
                      {errors.mobileNumber && (
                        <p className="error">{errors.mobileNumber}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="reg-sumbit-button">
                  <button type="button" onClick={handleSubmitSignup}>
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}
    </>
  );
};
export default AstrologerRegistration;
