import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";

const AstroDetailEdit = ({
  astroMobileNumber,
  setAddActiveClassEdit,
  setLoading,
  checkCompleteProfile,
  fetchAstrologers,
}) => {
  const [astroUpdateDetail, setAstroUpdateDetail] = useState({});
  const [professionsList, setProfessionsList] = useState([]);
  const [languageListData, setLanguageListData] = useState([]);
  const [astroRegelationDetail, setAstroRegelationDetail] = useState();
  const [aadhaarFile, setAadhaarFile] = useState(null);
  const [certificateFile, setCertificateFile] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    experience: "",
    charges: "",
    country: "",
    gender: "",
    description: "",
    languages: [],
    professions: [],
  });

  const [astroRegelationFormData, setAstroRegelationFormData] = useState({
    name: "",
    email: "",
    gender: "",
    dateOfBirth: "",
    deviceUse: "",
    languages: [],
  });

  const astrologerDetail = async (astroMobileNumber) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/astrologer-businessProfile-detail/${astroMobileNumber}`
      );
      const data = res.data;
      setAstroUpdateDetail(data);
      setFormData({
        name: data.name || "",
        experience: data.experience || "",
        charges: data.charges || "",
        country: data.country || "",
        gender: data.gender || "",
        description: data.Description || "",
        languages: data.languages || [],
        professions: data.professions || [],
      });
    } catch (err) {
      console.error(err);
    }
  };

  const astrologerRegelationDetail = async (astroMobileNumber) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/astrologer-detail/${astroMobileNumber}`
      );
      const data = res.data.data;
      setAstroRegelationDetail(data);
      setAstroRegelationFormData({
        name: data.name || "",
        email: data.email || "",
        gender: data.gender || "",
        dateOfBirth: data.dateOfBirth || "",
        deviceUse: data.deviceUse || "",
        languages: data.languages || [],
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (astroMobileNumber) {
      if (checkCompleteProfile) {
        astrologerDetail(astroMobileNumber);
      } else {
        astrologerRegelationDetail(astroMobileNumber);
      }
    } else {
      setLoading(false);
    }
  }, [astroMobileNumber, checkCompleteProfile]);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/add-Profession-astrologer`)
      .then((res) => setProfessionsList(res.data))
      .catch((err) => console.error(err));

    axios
      .get(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/add-Language-astrologer`)
      .then((res) => setLanguageListData(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e, key) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const updated = checked
        ? [...prev[key], value]
        : prev[key].filter((item) => item !== value);
      return { ...prev, [key]: updated };
    });
  };

  const handleRegelationInputChange = (e) => {
    const { name, value } = e.target;
    setAstroRegelationFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegelationCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setAstroRegelationFormData((prev) => {
      const updated = checked
        ? [...prev.languages, value]
        : prev.languages.filter((lang) => lang !== value);
      return { ...prev, languages: updated };
    });
  };

  const handleUpdate = async () => {
    const updateData = new FormData();
    updateData.append("name", formData.name);
    updateData.append("experience", formData.experience);
    updateData.append("charges", formData.charges);
    updateData.append("country", formData.country);
    updateData.append("gender", formData.gender);
    updateData.append("Description", formData.description);
    updateData.append("languages", JSON.stringify(formData.languages));
    updateData.append("professions", JSON.stringify(formData.professions));

    const imageFile = document.getElementById("image")?.files?.[0];
    if (imageFile) updateData.append("image", imageFile);

    setLoading(true);

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/astrologer-businessProfile-update/${astroMobileNumber}`,
        updateData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (res.data.message === "success") {
        toast.success("Profile updated successfully");
        fetchAstrologers();
        setAddActiveClassEdit(false);
      }
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegelationUpdate = async () => {
    const formData = new FormData();

    // Text Fields
    formData.append("name", astroRegelationFormData.name || "");
    formData.append("email", astroRegelationFormData.email || "");
    formData.append("gender", astroRegelationFormData.gender || "");
    formData.append("deviceUse", astroRegelationFormData.deviceUse || "");
    formData.append("dateOfBirth", astroRegelationFormData.dateOfBirth || "");

    // Languages as array
    astroRegelationFormData.languages.forEach((lang) => {
      formData.append("languages[]", lang);
    });

    // File uploads
    if (aadhaarFile) {
      formData.append("aadhaarCard", aadhaarFile, aadhaarFile.name);
    }
    if (certificateFile) {
      formData.append("certificate", certificateFile, certificateFile.name);
    }

    // Debugging - print all fields
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
    console.log(formData, "formData");

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/put-any-field-astrologer-registration/${astroMobileNumber}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.message === "success") {
        toast.success("Regulation profile updated");
        astrologerRegelationDetail(astroMobileNumber);
        fetchAstrologers();
        setAddActiveClassEdit(false);
      }
    } catch (err) {
      console.error("Regulation update failed:", err);
    }
  };

  return (
    <div className="astrologer-profile-edit-table">
      <span className="close" onClick={() => setAddActiveClassEdit(false)}>
        X
      </span>
      <h2>Astrologer Profile (Editable)</h2>

      {checkCompleteProfile ? (
        <div className="profile-table">
          <div className="inner-profile-table">
            <div className="common-profile">
              <div className="common-img">Upload Image</div>
              <div className="input-outer">
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
                  <img src="./user-icon-image.png" />
                )}
                <input type="file" id="image" name="image" />
              </div>
            </div>
            <div className="common-profile">
              <div className="name">Name</div>
              <div className="input-outer">
                <input
                  className="common-input-filed"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="common-profile">
              <div className="Experience">Experience</div>
              <div className="input-outer">
                <input
                  className="common-input-filed"
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="common-profile">
              <div className="Charges">Charges</div>

              <div className="input-outer">
                <input
                  className="common-input-filed"
                  type="text"
                  name="charges"
                  value={formData.charges}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="common-profile">
              <div className="gender">Gender</div>

              <div className="man-input-filed-sec input-outer">
                {["Male", "Female", "Other"].map((g) => (
                  <label key={g}>
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={formData.gender === g}
                      onChange={handleChange}
                    />
                    <label>{g}</label>
                  </label>
                ))}
              </div>
            </div>

            <div className="common-profile">
              <div className="country">Country</div>

              <div className="man-input-filed-sec input-outer">
                {["India", "Outside_India"].map((c) => (
                  <label key={c}>
                    <input
                      type="radio"
                      name="country"
                      value={c}
                      checked={formData.country === c}
                      onChange={handleChange}
                    />
                    <label>{c === "India" ? "India" : "Outside India"}</label>
                  </label>
                ))}
              </div>
            </div>

            <div className="common-profile">
              <div className="language">Languages</div>

              <div className="man-input-filed-sec input-outer">
                {languageListData.map((lang) => (
                  <label key={lang._id}>
                    <input
                      type="checkbox"
                      name="languages"
                      value={lang.languages}
                      checked={formData.languages.includes(lang.languages)}
                      onChange={(e) => handleCheckboxChange(e, "languages")}
                    />
                    <span>
                      {lang.languages}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="common-profile">
              <div className="profession">Professions</div>
              <div className="input-outer man-input-filed-sec">
                {professionsList.map((prof) => (
                  <label key={prof._id}>
                    <input
                      type="checkbox"
                      name="professions"
                      value={prof.professions}
                      checked={formData.professions.includes(prof.professions)}
                      onChange={(e) => handleCheckboxChange(e, "professions")}
                    />
                    <span>

                    {prof.professions}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="common-profile">
              <div className="description">Description</div>
              <div className="input-outer">
                <textarea
                  className="common-input-filed"
                  name="description"
                  rows="4"
                  cols="30"
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <h2>
            {!astroRegelationDetail?.completeProfile &&
              "Astrologer Profile is not completed"}
          </h2>
          <div className="profile-table">
            <div className="inner-profile-table">
              <div className="common-profile">
                <div className="name">Name</div>
                <div className="input-outer">
                  <input
                    className="common-input-filed"
                    type="text"
                    name="name"
                    value={astroRegelationFormData.name}
                    onChange={handleRegelationInputChange}
                  />
                </div>
              </div>
              <div className="common-profile">
                <div className="email">Email</div>
                <div className="input-outer">
                  <input
                    className="common-input-filed"
                    type="email"
                    name="email"
                    value={astroRegelationFormData.email}
                    onChange={handleRegelationInputChange}
                  />
                </div>
              </div>
              <div className="common-profile">
                <div className="device-use">DeviceUse</div>
                <div className="input-outer">
                  <input
                    className="common-input-filed"
                    type="text"
                    name="deviceUse"
                    value={astroRegelationFormData.deviceUse}
                    onChange={handleRegelationInputChange}
                  />
                </div>
              </div>
              <div className="common-profile">
                <div className="mobile">MobileNumber</div>
                <div className="input-outer">
                  {astroRegelationDetail?.mobileNumber}
                </div>
              </div>
              <div className="common-profile">
                <div className="gender">Gender</div>

                <div className="man-input-filed-sec input-outer">
                  {["Male", "Female", "Other"].map((g) => (
                    <label key={g}>
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={astroRegelationFormData.gender === g}
                        onChange={handleRegelationInputChange}
                      />
                      <label>{g}</label>
                    </label>
                  ))}
                </div>
              </div>
              <div className="common-profile">
                <div className="language">Language</div>
                <div className="man-input-filed-sec input-outer">
                  {languageListData.map((lang) => (
                    <label key={lang._id}>
                      <input
                        type="checkbox"
                        name="languages"
                        value={lang.languages}
                        checked={astroRegelationFormData.languages.includes(
                          lang.languages
                        )}
                        onChange={handleRegelationCheckboxChange}
                      />
                      <span>{lang.languages}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="common-profile">
                <div className="date-of-birth">DateOfBirth</div>
                <div className="input-outer">
                  <input
                    className="common-input-filed"
                    type="date"
                    name="dateOfBirth"
                    value={astroRegelationFormData.dateOfBirth}
                    onChange={handleRegelationInputChange}
                  />
                </div>
              </div>
              <div className="common-profile">
                <div className="adhar-card">AadhaarCard</div>
                <div className="input-outer">
                  {astroRegelationDetail?.aadhaarCard ? (
                    <Image
                      width={100}
                      height={100}
                      src={
                        process.env.NEXT_PUBLIC_WEBSITE_URL +
                        astroRegelationDetail?.aadhaarCard
                      }
                      alt="aadhaar"
                    />
                  ) : (
                    <img src="./user-icon-image.png" />
                  )}
                  <input
                    type="file"
                    id="aadhaar"
                    name="aadhaar"
                    onChange={(e) => setAadhaarFile(e.target.files[0])}
                  />
                </div>
              </div>
              <div className="common-profile">
                <div className="certificate">Certificate</div>
                <div className="input-outer">
                  {astroRegelationDetail?.certificate ? (
                    <Image
                      width={100}
                      height={100}
                      src={
                        process.env.NEXT_PUBLIC_WEBSITE_URL +
                        astroRegelationDetail?.certificate
                      }
                      alt="certificate"
                    />
                  ) : (
                    <img src="./user-icon-image.png" />
                  )}
                  <input
                    type="file"
                    id="certificate"
                    name="certificate"
                    onChange={(e) => setCertificateFile(e.target.files[0])}
                  />
                </div>
              </div>
            </div>
          </div>
          <button onClick={handleRegelationUpdate}>
            Update Regulation Profile
          </button>
        </>
      )}

      {checkCompleteProfile && (
        <button onClick={handleUpdate}>Update Business Profile</button>
      )}
    </div>
  );
};

export default AstroDetailEdit;
