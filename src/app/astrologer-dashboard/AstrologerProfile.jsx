"use client";
import axios from "axios";
// import { fetchDataBusinessProfile } from "../chat-with-astrologer/page";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { validateAstrologerForm } from "../component/FormValidation";
import secureLocalStorage from "react-secure-storage";

const AstrologerProfile = ({ setSuccessMessageProfile }) => {
  const astrologerPhone = secureLocalStorage.getItem("astrologer-phone");
  const [registrationDetail, setRegistrationDetail] = useState();
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState();

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/astrologer-detail/${astrologerPhone}`
      )
      .then((res) => {
        setRegistrationDetail(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const handleBusinessProfile = async () => {
    const validationErrors = validateAstrologerForm('astroProfile');
    console.log(validationErrors);
    
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const formData = new FormData();
    formData.append("name", document.getElementById("fname").value);
    formData.append("profession", document.getElementById("profession").value);
    formData.append("languages", document.getElementById("language").value);
    formData.append(
      "experience",
      document.getElementById("Experience")?.value || ""
    );
    formData.append("charges", document.getElementById("Charges").value);
    formData.append(
      "Description",
      document.getElementById("description").value
    );
    // formData.append("minute", document.getElementById("minute").value);
    formData.append(
      "mobileNumber",
      document.getElementById("mobileNumber").value
    );
    formData.append("profileStatus", true);
    formData.append("chatStatus", false);

    // Append the image file
    const imageFile = document.getElementById("image").files[0];
    if (!imageFile) {
      console.warn("Image file is required.");
      return;
    }
    formData.append("image", imageFile);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/astrologer-businessProfile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.message === "success") {
        // document.getElementById("fname").value = "";
        document.getElementById("profession").value = "";
        // document.getElementById("language").value = "";
        document.getElementById("Experience").value = "";
        document.getElementById("description").value = "";
        document.getElementById("Charges").value = "";
        // document.getElementById("minute").value = "";
        // document.getElementById("mobileNumber").value = "";
        // setSuccessMessage(response.data.message)
        console.log("Form reset successfully.");
        setSuccessMessageProfile(response.data);
        setSuccessMessage(response.data.message)
        toast.success("Profile Completed Successfully", {
          position: "top-right",
        });
      }

      // fetchDataBusinessProfile();
      console.log("Registration successful:", response.data);
    } catch (error) {
      console.log(
        "Error in registration:",
        error.response?.data?.message || error.message
      );
    }
  };


  const handleBusinessProfileUpdate = async () =>{
    console.log("prifile update");
    
  }
  return (
    <div className="container">
      <div className="astrologer-registration-form">
        <h2>Please Complete the Profile then you connect the user.</h2>
        <form action="">
          <div className="user-profile-pick-main">
            <div className="user-profile-pick">
              <a href="#" title="">
                <img src="./user-icon-image.png" alt="user-icon" />
                <span>
                  <i className="fa-solid fa-ellipsis-vertical"></i>
                </span>
              </a>
            </div>
            <div className="add-profile-content">
              <div className="inner-form-filed-sec full">
                <div className="label-content">
                  <label htmlFor="image">
                    Upload Image <span>(छवि अपलोड करें)</span>
                  </label>
                </div>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept=".jpg, .jpeg, .png"
                  className="common-input-filed"
                />
                {errors.imagePic && <p className="error">{errors.imagePic}</p>}
              </div>
            </div>
          </div>

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
                value={registrationDetail?.name}
              />
              {errors.firstName && <p className="error">{errors.firstName}</p>}
            </div>

            <div className="inner-form-filed-sec">
              <div className="label-content">
                <label>
                  profession <span>पेशा</span>
                </label>
              </div>
              <div className="man-input-filed-sec">
                <select
                  name="profession"
                  id="profession"
                  className="common-input-filed"
                >
                  <option value="Please select profession">
                    Please select profession
                  </option>
                  <option value="Numerology">Numerology</option>
                  <option value="Vastu">Vastu</option>
                  <option value="Tarot">Tarot</option>
                  <option value="Life Coach">Life Coach</option>
                </select>
                {errors.professions && (
                  <p className="error">{errors.professions}</p>
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
                  value={registrationDetail?.languages}
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
                <label for="Name">
                  Experience <span>अनुभव</span>
                </label>
              </div>
              <input
                type="text"
                id="Experience"
                name="Experience"
                className="common-input-filed"
                placeholder="Exp:"
              />
              {errors.Experience && (
                <p className="error">{errors.Experience}</p>
              )}
            </div>

            <div className="inner-form-filed-sec full">
              <div className="label-content">
                <label for="Name">
                  Charges <span>शुल्क</span>
                </label>
              </div>
              <input
                type="text"
                id="Charges"
                name="Charges"
                className="common-input-filed"
                placeholder="enter your charge"
              />
              {errors.Charges && <p className="error">{errors.Charges}</p>}
            </div>

            {/* <div className="inner-form-filed-sec full">
              <div className="label-content">
                <label for="Name">
                  Charges per minute <span>प्रति मिनट शुल्क</span>
                </label>
              </div>
              <input
                type="text"
                id="minute"
                name="minute"
                className="common-input-filed"
                placeholder="enter your time"
              />
              {errors.minute && <p className="error">{errors.minute}</p>}
            </div> */}

            <div className="inner-form-filed-sec full">
              <div className="label-content">
                <label for="Name">
                  Mobile Number <span>मोबाइल नंबर</span>
                </label>
              </div>
              <input
                type="text"
                placeholder="Enter phone number"
                id="mobileNumber"
                name="quantity"
                value={registrationDetail?.mobileNumber}
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

            <div className="inner-form-filed-sec full">
              <div className="label-content">
                <label for="Name">
                  Description <span>पविवरण</span>
                </label>
              </div>
              <textarea id="description"></textarea>
            </div>
          </div>

          <div className="reg-sumbit-button">
            {successMessage!=="success" ? 
            <button type="button" onClick={handleBusinessProfile}>
              Submit
            </button>  
            :
            <button type="button" onClick={handleBusinessProfileUpdate}>
             Update Profile
            </button>
            }
          </div>
        </form>
      </div>
    </div>
  );
};

export default AstrologerProfile;
