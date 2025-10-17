"use client";
import axios from "axios";
// import { fetchDataBusinessProfile } from "../chat-with-astrologer/page";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { validateAstrologerForm } from "../component/FormValidation";
import secureLocalStorage from "react-secure-storage";
import Cookies from "js-cookie";
import Loader from "../component/Loader";
import Image from "next/image";

const AstrologerProfile = ({
  setSuccessMessageProfile,
  astrologerData,
  registrationDetail,
  setRegistrationDetail,
}) => {
  const [astrologerPhone, setAstrologerPhone] = useState();
  const [astroUpdateDetail, setAstroUpdateDetail] = useState();
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState();
  const [professionsList, setProfessionsList] = useState([]);
  const [languageListData, setLanguageListData] = useState([]);
  const [loader, setLoader] = useState(false);

  const [name, setName] = useState("");
  const [experience, setExperience] = useState("");
  const [editProfessions, setEditProfessions] = useState("");
  const [editLanguages, setEditLanguages] = useState("");
  const [editCharges, setEditCharges] = useState("");
  const [editCountry, setEditCountry] = useState("");
  const [editGender, setEditGender] = useState("");
  const [editDescription, setEditDescription] = useState("");
  console.log(registrationDetail);

  const astrologerLoginUpdate = secureLocalStorage.getItem(
    "astrologerLoginUpdate"
  );

  useEffect(() => {
    const astrologerPhones = Cookies.get("astrologer-phone");
    setAstrologerPhone(astrologerPhones);
  }, []);

  useEffect(() => {
    if (!astrologerPhone) return;
    axios
      .get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/astrologer-businessProfile-detail/${astrologerPhone}`
      )
      .then((res) => {
        setAstroUpdateDetail(res.data);
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [astrologerPhone]);

  useEffect(() => {
    if (!astrologerPhone) return;
    axios
      .get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/astrologer-detail/${astrologerPhone}`
      )
      .then((res) => {
        setRegistrationDetail(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [astrologerPhone]);

  const handleBusinessProfile = async () => {
    const validationErrors = validateAstrologerForm("astroProfile");
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      toast.error("Profile not Completed", {
        position: "top-right",
      });
    }

    const formData = new FormData();

    // Basic fields
    const selectedGender =
      document.querySelector('input[name="gender"]:checked')?.value || "";
    const selectedCountry =
      document.querySelector('input[name="country"]:checked')?.value || "";
    console.log(selectedGender, selectedCountry);

    formData.append("gender", selectedGender);
    formData.append("country", selectedCountry);
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
    formData.append("freeChatStatus", false);

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
    if (registrationDetail) {
      // Append certificate if available
      if (registrationDetail?.certificate) {
        formData.append("certificate", registrationDetail.certificate);
      }

      // Append aadhaarCard if available
      if (registrationDetail?.aadhaarCard) {
        formData.append("aadhaarCard", registrationDetail.aadhaarCard);
      }
    }

    if (!document.getElementById("image").files.length) {
      errors.imagePic = "Image is required";
    }
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/astrologer-businessProfile`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.message == "success") {
        //======= agr hm ise start krte hai to new astrologer login ni hoga.========

        const innerRes = await axios.put(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/put-any-field-astrologer-registration/${astrologerPhone}`,
          {
            name: response.data.BusinessProfileData?.name,
            charges: response.data.BusinessProfileData?.charges,
            completeProfile: true,
          }
        );
        if (innerRes.status == 200) {
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
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      }

      console.log("Registration successful:", response.data);
    } catch (error) {
      console.error("Error in registration:", error.response.data.error);
      toast.error(error.response.data.error, {
        position: "top-right",
      });
    }
  };

  const fetchLanguageList = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/add-Language-astrologer`
      );
      setLanguageListData(response.data);
    } catch (error) {
      console.error("Fetch language list error:", error);
    } finally {
    }
  };

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
    fetchLanguageList();
  }, []);

  const handleBusinessProfileUpdate = async (mobileNumber) => {
    const formData = new FormData();
    console.log(formData, "formData");

    setLoader(true);
    // Basic fields
    const selectedGender =
      document.querySelector('input[name="gender"]:checked')?.value || "";
    const selectedCountry =
      document.querySelector('input[name="country"]:checked')?.value || "";

    formData.append("gender", selectedGender);
    formData.append("country", selectedCountry);
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

    // Helper to get selected checkbox values
    const getSelectedValues = (name) => {
      return Array.from(
        document.querySelectorAll(`input[name="${name}"]:checked`)
      ).map((input) => input.value);
    };

    // Selected arrays
    const selectedLanguages = getSelectedValues("languages");
    const selectedProfessions = getSelectedValues("profession");

    // ✅ Append as JSON strings
    formData.append("languages", JSON.stringify(selectedLanguages));
    formData.append("professions", JSON.stringify(selectedProfessions));
    if (registrationDetail) {
      // Append certificate if available
      if (registrationDetail?.certificate) {
        formData.append("certificate", registrationDetail.certificate);
      }

      // Append aadhaarCard if available
      if (registrationDetail?.aadhaarCard) {
        formData.append("aadhaarCard", registrationDetail.aadhaarCard);
      }
    }

    // ✅ Image is optional
    const imageFile = document.getElementById("image")?.files?.[0];
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/astrologer-businessProfile-update/${mobileNumber}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);

      if (response.data.message == "success") {
        toast.success("Profile Completed Successfully", {
          position: "top-right",
        });
        const updateList = await axios.put(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/put-any-field-astrologer-registration/${astrologerPhone}`,
          {
            name: response.data.updatedProfile?.name,
            charges: response.data.updatedProfile?.charges,
            completeProfile: true,
          }
        );

        // if (updateList.status == 200) {
        //   window.location.reload();
        // }
        console.log("Profile update response:", updateList);
      }

      // Show success toast or UI update here
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    // Initialize name based on profileStatus and existing data
    if (astroUpdateDetail) {
      setName(astroUpdateDetail?.name || "");
    } else {
      setName(registrationDetail?.name || "");
    }
    setExperience(astroUpdateDetail?.experience || "");
    setEditProfessions(astroUpdateDetail?.professions || []);
    setEditLanguages(astroUpdateDetail?.languages || []);
    setEditCharges(astroUpdateDetail?.charges || "");
    setEditCountry(astroUpdateDetail?.country || "");
    setEditGender(astroUpdateDetail?.gender || "");
    setEditDescription(astroUpdateDetail?.Description || "");
  }, [astrologerData, registrationDetail, astroUpdateDetail]);

  const handleProfessionChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setEditProfessions((prev) => [...prev, value]);
    } else {
      setEditProfessions((prev) => prev.filter((item) => item !== value));
    }
  };
  const handleLanguagesChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setEditLanguages((prev) => [...prev, value]);
    } else {
      setEditLanguages((prev) => prev.filter((item) => item !== value));
    }
  };
  console.log(astroUpdateDetail);

  return (
    <>
      {loader && <Loader />}

      <div
        className={`astrologer-registration-form ${
          astrologerData?.completeProfile == true ? "update-profile" : ""
        }`}
      >
        {astrologerData?.completeProfile !== true && (
          <h2>Please complete your profile before connecting with the user.</h2>
        )}
        <form action="">
          <div className="user-profile-pick-main">
            {" "}
              <label>Adhar Card </label>

            <div className="user-profile-pick">
              <a href="#" title="">
                {astroUpdateDetail?.profileImage ? (
                  <Image
                    width={100}
                    height={100}
                    src={
                      process.env.NEXT_PUBLIC_WEBSITE_URL +
                      astroUpdateDetail?.aadhaarCard
                    }
                    alt="user-icon"
                  />
                ) : (
                  <img src="./user-icon-image.png"></img>
                )}

                <span>
                  <i className="fa-solid fa-ellipsis-vertical"></i>
                </span>
              </a>
            </div>
            <div className="user-profile-pick">
              <a href="#" title="">
                {astroUpdateDetail?.profileImage ? (
                  <Image
                    width={100}
                    height={100}
                    src={
                      process.env.NEXT_PUBLIC_WEBSITE_URL +
                      astroUpdateDetail?.profileImage
                    }
                    alt="user-icon"
                  />
                ) : (
                  <img src="./user-icon-image.png"></img>
                )}

                <span>
                  <i className="fa-solid fa-ellipsis-vertical"></i>
                </span>
              </a>
            </div>
             <div className="user-profile-pick">
              <label>Certificate </label>
              <a href="#" title="">
                {astroUpdateDetail?.profileImage ? (
                  <Image
                    width={100}
                    height={100}
                    src={
                      process.env.NEXT_PUBLIC_WEBSITE_URL +
                      astroUpdateDetail?.certificate
                    }
                    alt="user-icon"
                  />
                ) : (
                  <img src="./user-icon-image.png"></img>
                )}

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
                  onChange={() => {
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.imagePic;
                      return newErrors;
                    });
                  }}
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
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.firstName && <p className="error">{errors.firstName}</p>}
            </div>

            <div className="inner-form-filed-sec">
              <div className="label-content">
                <label for="Name">
                  Experience <span>(अनुभव)</span>
                </label>
              </div>
              <input
                type="text"
                id="Experience"
                name="Experience"
                className="common-input-filed"
                placeholder="Exp:"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />
              {errors.Experience && (
                <p className="error">{errors.Experience}</p>
              )}
            </div>

            <div className="inner-form-filed-sec">
              <div className="label-content">
                <label>
                  Skills <span>(कौशल)</span>
                </label>
              </div>
              <div className="man-input-filed-sec">
                {professionsList?.map((item) => (
                  <label key={item._id}>
                    <input
                      type="checkbox"
                      name="profession"
                      value={item.professions}
                      checked={editProfessions.includes(item.professions)}
                      onChange={handleProfessionChange}
                    />
                    <span>{item.professions}</span>
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
                {languageListData?.map((lang) => {
                  return (
                    <label key={lang._id}>
                      <input
                        type="checkbox"
                        name="languages"
                        value={lang.languages}
                        id="languages"
                        checked={editLanguages.includes(lang.languages)}
                        onChange={handleLanguagesChange}
                      />
                      <span>{lang.languages}</span>
                    </label>
                  );
                })}
                {errors.languages && (
                  <p className="error">{errors.languages}</p>
                )}
              </div>
            </div>

            <div className="inner-form-filed-sec full">
              <div className="label-content">
                <label for="Name">
                  Charges <span>(शुल्क)</span>
                </label>
              </div>
              <input
                type="text"
                id="Charges"
                name="Charges"
                className="common-input-filed"
                placeholder="enter your charge"
                value={editCharges}
                onChange={(e) => setEditCharges(e.target.value)}
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

            <div className="inner-form-filed-sec">
              <div className="label-content">
                <label htmlFor="country">
                  Country <span>(देश)</span>
                </label>
              </div>
              <div className="man-input-filed-sec input-gender-sec">
                <div className="inner-radio">
                  <input
                    type="radio"
                    name="country"
                    value="India"
                    checked={editCountry === "India"}
                    onChange={(e) => setEditCountry(e.target.value)}
                  />
                  <label>India</label>
                </div>

                <div className="inner-radio">
                  <input
                    type="radio"
                    name="country"
                    value="Outside_India"
                    checked={editCountry === "Outside_India"}
                    onChange={(e) => setEditCountry(e.target.value)}
                  />
                  <label>Outside India</label>
                </div>
                {errors.country && <p className="error">{errors.country}</p>}
              </div>
            </div>

            <div className="inner-form-filed-sec">
              <div className="label-content">
                <label htmlFor="gender">
                  Gender <span>(लिंग)</span>
                </label>
              </div>
              <div className="man-input-filed-sec input-gender-sec">
                <div className="inner-radio">
                  <input
                    type="radio"
                    id="Male"
                    name="gender"
                    value="Male"
                    checked={editGender === "Male"}
                    onChange={(e) => setEditGender(e.target.value)}
                  />
                  <label>Male</label>
                </div>

                <div className="inner-radio">
                  <input
                    type="radio"
                    id="Female"
                    name="gender"
                    value="Female"
                    checked={editGender === "Female"}
                    onChange={(e) => setEditGender(e.target.value)}
                  />
                  <label>Female</label>
                </div>
                <div className="inner-radio">
                  <input
                    type="radio"
                    id="Other"
                    name="gender"
                    value="Other"
                    checked={editGender === "Other"}
                    onChange={(e) => setEditGender(e.target.value)}
                  />
                  <label>Other</label>
                </div>
                {errors.gender && <p className="error">{errors.gender}</p>}
              </div>
            </div>

            <div className="inner-form-filed-sec full">
              <div className="label-content">
                <label for="Name">
                  Mobile Number <span>(मोबाइल नंबर)</span>
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
                  Description <span>(पविवरण)</span>
                </label>
              </div>
              <textarea
                id="description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              ></textarea>
            </div>
          </div>

          <div className="reg-sumbit-button">
            {astroUpdateDetail?.completeProfile == true ? (
              <button
                type="button"
                onClick={() => {
                  handleBusinessProfileUpdate(registrationDetail?.mobileNumber);
                }}
              >
                Update Profile
              </button>
            ) : (
              <button type="button" onClick={handleBusinessProfile}>
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default AstrologerProfile;
