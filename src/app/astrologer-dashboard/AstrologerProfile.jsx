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
  const [professionsList, setProfessionsList] = useState([]);
  const astrologerLoginUpdate = secureLocalStorage.getItem("astrologerLoginUpdate")
  const [astrologerData, setAstrologerData] = useState("");
console.log(astrologerData);

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
    const validationErrors = validateAstrologerForm("astroProfile");
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const formData = new FormData();

    // Basic fields
    formData.append("name", document.getElementById("fname").value);
    formData.append(
      "experience",
      document.getElementById("Experience")?.value || ""
    );
    formData.append("charges", document.getElementById("Charges").value);
    formData.append(
      "Description",
      document.getElementById("description").value
    );
    formData.append(
      "mobileNumber",
      document.getElementById("mobileNumber").value
    );
    formData.append("profileStatus", true);
    formData.append("chatStatus", false);

    // Helper to get selected checkbox values
    const getSelectedValues = (name) => {
      return Array.from(
        document.querySelectorAll(`input[name="${name}"]:checked`)
      ).map((input) => input.value);
    };

    // Append selected languages and professions
    const selectedLanguages = getSelectedValues("languages");
    const selectedProfessions = getSelectedValues("profession");

    // ✅ Append as JSON strings
    formData.append("languages", JSON.stringify(selectedLanguages));
    formData.append("professions", JSON.stringify(selectedProfessions));

    // Append image
    const imageFile = document.getElementById("image").files[0];
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/astrologer-businessProfile`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.message === "success") {
        // Reset only needed fields
        ["Experience", "Charges", "description", "image"].forEach((id) => {
          const el = document.getElementById(id);
          if (el) el.value = "";
        });

        // Uncheck checkboxes
        ["profession", "languages"].forEach((name) => {
          document
            .querySelectorAll(`input[name="${name}"]`)
            .forEach((el) => (el.checked = false));
        });

        setSuccessMessageProfile(response.data);
        secureLocalStorage.setItem("astrLoginStatus", "0");

        toast.success("Profile Completed Successfully", {
          position: "top-right",
        });

      }

      console.log("Registration successful:", response.data);
    } catch (error) {
      console.error(
        "Error in registration:",
        error.response?.data?.message || error.message
      );
    }
  };

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/astrologer-businessProfile/${astrologerPhone}`
      )
      .then((response) => {
        setAstrologerData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

 

  const fetchProfessionsList = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/add-Profession-astrologer`
      );
      setProfessionsList(response.data);
    } catch (error) {
      console.error("Fetch professions list error:", error);
    }
  };
  useEffect(() => {
    fetchProfessionsList();
  }, []);

  const handleBusinessProfileUpdate = async () => {
    console.log("prifile update");
  };
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
                  Profession <span>पेशा</span>
                </label>
              </div>
              <div className="man-input-filed-sec">
                {professionsList?.map((item) => (
                  <label key={item._id}>
                    <input
                      type="checkbox"
                      name="profession"
                      value={item.professions}
                    />
                    {item.professions}
                  </label>
                ))}
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
                {registrationDetail?.languages.map((lang) => {
                  return (
                    <label>
                      <input
                        type="checkbox"
                        name="languages"
                        value={lang}
                        id="languages"
                        // onChange={handleLanguageCheckboxChange}
                      />
                      {lang}
                    </label>
                  );
                })}
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
            {astrologerData?.profileStatus !== true ? (
              <button type="button" onClick={handleBusinessProfile}>
                Submit
              </button>
            ) : (
              <button type="button" onClick={handleBusinessProfileUpdate}>
                Update Profile
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AstrologerProfile;
