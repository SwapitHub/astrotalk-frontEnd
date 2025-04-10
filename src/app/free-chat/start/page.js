"use client";
import { validateAstrologerForm } from "@/app/component/FormValidation";
import UserOtpLoginData from "@/app/component/userOtpLoginData";
import { useState } from "react";

const StartUserName = () => {
  const [dateOfBirthAvailable, setDateOfBirthAvailable] = useState("no");
  const [otpPopUpDisplay, setOtpPopUpDisplay] = useState(false);
  const [errors, setErrors] = useState({});
console.log(errors);

  const handleUserSignUpData = async () => {
    const validationErrors = validateAstrologerForm('user');
    console.log(validationErrors);
    
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const formData = {
      first_name: document.getElementById("fname").value.trim(),
      gender: document.querySelector('input[name="gender"]:checked')?.value,
      date_of_birth: document.getElementById("birthdayany").value.trim(),
      re_use_date_of_birth:
        document.getElementById("birthdayReUse")?.value.trim() || "",
      placeOfBorn: document.getElementById("searchAddress").value.trim(),
      languages: document.getElementById("language").value.trim(),
    };
    if (formData) {
      setOtpPopUpDisplay(true);
    }
  };

  return (
    <>
      <section className="astrologer-registration-bg">
        <div className="container">
          <div className={otpPopUpDisplay == true && `outer-send-otp-main`}>
            {otpPopUpDisplay && (
              <UserOtpLoginData setOtpPopUpDisplay={setOtpPopUpDisplay} />
            )}
          </div>
          <div className="user-login-and-uder-reg-bg">
            <div className="user-reg-ctm">
              <div className="inner-astrologer-registration">
                <div className="registration-heading">
                  <h1 className="common-h1-heading">User Registration</h1>
                </div>
              </div>
              <div className="user-registration-form">
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
                        placeholder="What is your name?"
                        required
                      />
                      {errors.firstName && (
                        <p className="error">{errors.firstName}</p>
                      )}
                    </div>
                    <div className="inner-form-filed-sec">
                      <div className="label-content">
                        <label for="Gender">
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
                        <label for="html">Male</label>
                        <input
                          type="radio"
                          id="Female"
                          name="gender"
                          value="Female"
                        />
                        <label for="css">Female</label>
                        <input
                          type="radio"
                          id="Other"
                          name="gender"
                          value="Other"
                        />
                        <label for="css">Other</label>
                        {errors.gender && (
                          <p className="error">{errors.gender}</p>
                        )}
                      </div>
                    </div>

                    <div className="inner-form-filed-sec">
                      <div className="label-content">
                        <label for="birthdayany">
                          Date of Birth <span>(जन्मतिथि)</span>
                        </label>
                      </div>
                      <div className="man-input-filed-sec">
                        <input
                          type="date"
                          id="birthdayany"
                          name="birthdayany"
                          className="common-input-filed"
                          placeholder="Select your birth date"
                          required
                        />
                        {errors.dateOfBirthAnys && (
                          <p className="error">{errors.dateOfBirthAnys}</p>
                        )}
                      </div>
                    </div>
                    <div className="inner-form-filed-sec">
                      <div className="label-content">
                        <label for="Gender">
                          Do you know your time of birth?
                          <span>(क्या आप अपना जन्म समय जानते हैं?)</span>
                        </label>
                      </div>
                      <div className="man-input-filed-sec input-gender-sec common-input-filed">
                        <input
                          type="radio"
                          id="yes"
                          name="YesNO"
                          value="yes"
                          required
                          onChange={() => setDateOfBirthAvailable("yes")}
                        />
                        <label for="html">Yes</label>
                        <input
                          type="radio"
                          id="no"
                          name="YesNO"
                          value="no"
                          required
                          onChange={() => setDateOfBirthAvailable("no")}
                        />
                        <label for="css">No</label>
                      </div>
                      {dateOfBirthAvailable == "yes" && (
                        <div className="man-input-filed-sec know-your-time">
                          <input
                            type="date"
                            id="birthdayReUse"
                            name="birthdaytime"
                            className="common-input-filed"
                            placeholder="Select your birth time"
                          />
                        </div>
                      )}
                    </div>

                    <div className="inner-form-filed-sec you-born-ctm-filed">
                      <div className="label-content">
                        <label for="Languages">
                          Where were you born?
                          <span>(आपका जन्म कहां हुआ था?)</span>
                        </label>
                      </div>
                      <div className="man-input-filed-sec">
                        <div className="erch-input-filed common-input-filed">
                          <input
                            type="search"
                            id="searchAddress"
                            name="gsearch"
                            placeholder="Where were you born"
                          />
                          <button type="submit" className="ctm-white-color">
                            <i className="fa-solid fa-magnifying-glass"></i>
                          </button>
                        </div>
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
                          required
                        >
                          <option value="select language">
                            Select all your languages?
                          </option>
                          <option value="English">English</option>
                          <option value="Hindi">Hindi</option>
                          <option value="Bengali">Bengali</option>
                          <option value="Assamese">Assamese</option>
                          <option value="Punjabi">Punjabi</option>
                        </select>
                        {errors.languages && (
                          <p className="error">{errors.languages}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="reg-sumbit-button">
                    <button type="button" onClick={handleUserSignUpData}>
                      Start Chat With Astrologer
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default StartUserName;
