"use client";
import Loader from "@/app/component/Loader";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const WalletEditAstro = ({
  mobileNumber,
  setAddActiveClassEdit,
  fetchTransactions,
  setLoading,
}) => {
  const [astroUpdateDetail, setAstroUpdateDetail] = useState();

  const [name, setName] = useState("");
  const [experience, setExperience] = useState("");
  const [editProfessions, setEditProfessions] = useState([]);
  const [editLanguages, setEditLanguages] = useState([]);
  const [editCharges, setEditCharges] = useState("");
  const [editCountry, setEditCountry] = useState("");
  const [editGender, setEditGender] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [professionsList, setProfessionsList] = useState([]);
  const [languageListData, setLanguageListData] = useState([]);

  useEffect(() => {
    if (!mobileNumber) return;

    axios
      .get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/astrologer-businessProfile-detail/${mobileNumber}`
      )
      .then((res) => setAstroUpdateDetail(res.data))
      .catch((error) => console.log(error));
  }, [mobileNumber]);

  const fetchLanguageList = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/add-Language-astrologer`
      );
      setLanguageListData(response.data);
    } catch (error) {
      console.error("Fetch language list error:", error);
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

  useEffect(() => {
    if (astroUpdateDetail) {
      setName(astroUpdateDetail?.name || "");
      setExperience(astroUpdateDetail?.experience || "");
      setEditProfessions(astroUpdateDetail?.professions || []);
      setEditLanguages(astroUpdateDetail?.languages || []);
      setEditCharges(astroUpdateDetail?.charges || "");
      setEditCountry(astroUpdateDetail?.country || "");
      setEditGender(astroUpdateDetail?.gender || "");
      setEditDescription(astroUpdateDetail?.Description || "");
    }
  }, [astroUpdateDetail]);

  const handleProfessionChange = (e) => {
    const { value, checked } = e.target;
    setEditProfessions((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

  const handleLanguagesChange = (e) => {
    const { value, checked } = e.target;
    setEditLanguages((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

  const handleBusinessProfileUpdate = async (mobileNumber) => {
    const formData = new FormData();
    setLoading(true);

    formData.append("gender", editGender);
    formData.append("country", editCountry);
    formData.append("name", name);
    formData.append("experience", experience);
    formData.append("charges", editCharges);
    formData.append("Description", editDescription);
    formData.append("languages", JSON.stringify(editLanguages));
    formData.append("professions", JSON.stringify(editProfessions));

    const imageFile = document.getElementById("image")?.files?.[0];
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/astrologer-businessProfile-update/${mobileNumber}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.message === "success") {
        toast.success("Profile Updated Successfully", {
          position: "top-right",
        });
        fetchTransactions();
        setAddActiveClassEdit(false);

        await axios.put(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/put-any-field-astrologer-registration/${mobileNumber}`,
          {
            name: response.data.updatedProfile?.name,
            charges: response.data.updatedProfile?.charges,
            completeProfile: true,
          }
        );
      }
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="astrologer-registration-form update-profile wallet-edit-main">
        <span
          className="close"
          onClick={() => {
            setAddActiveClassEdit(false);
          }}
        >
          X
        </span>
        <form>
          <div className="user-profile-pick-main">
            <div className="user-profile-pick">
              {astroUpdateDetail?.profileImage ? (
                <Image
                  width={100}
                  height={100}
                  src={`${process.env.NEXT_PUBLIC_WEBSITE_URL}${astroUpdateDetail?.profileImage}`}
                  alt="user-icon"
                />
              ) : (
                <img src="./user-icon-image.png" alt="Default profile" />
              )}
            </div>
            <div className="add-profile-content">
              <div className="inner-form-filed-sec full">
                <label htmlFor="image">Upload Image</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept=".jpg, .jpeg, .png"
                  className="common-input-filed"
                />
              </div>
            </div>
          </div>

          <div className="form-filed-section-bg">
            <div className="inner-form-filed-sec">
              <label>Name</label>
              <input
                type="text"
                id="fname"
                className="common-input-filed"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="inner-form-filed-sec">
              <label>Experience</label>
              <input
                type="text"
                id="Experience"
                className="common-input-filed"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />
            </div>

            <div className="inner-form-filed-sec">
              <label>Skills</label>
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
              </div>
            </div>

            <div className="inner-form-filed-sec">
              <label>Languages</label>
              <div className="man-input-filed-sec">
                {languageListData?.map((lang) => (
                  <label key={lang._id}>
                    <input
                      type="checkbox"
                      name="languages"
                      value={lang.languages}
                      checked={editLanguages.includes(lang.languages)}
                      onChange={handleLanguagesChange}
                    />
                    <span>{lang.languages}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="inner-form-filed-sec full">
              <label>Charges</label>
              <input
                type="text"
                id="Charges"
                className="common-input-filed"
                value={editCharges}
                onChange={(e) => setEditCharges(e.target.value)}
              />
            </div>

            <div className="inner-form-filed-sec">
              <label>Country</label>
              <div className="input-gender-sec">
                <label>
                  <input
                    type="radio"
                    name="country"
                    value="India"
                    checked={editCountry === "India"}
                    onChange={(e) => setEditCountry(e.target.value)}
                  />
                  India
                </label>
                <label>
                  <input
                    type="radio"
                    name="country"
                    value="Outside_India"
                    checked={editCountry === "Outside_India"}
                    onChange={(e) => setEditCountry(e.target.value)}
                  />
                  Outside India
                </label>
              </div>
            </div>

            <div className="inner-form-filed-sec">
              <label>Gender</label>
              <div className="input-gender-sec">
                {["Male", "Female", "Other"].map((gender) => (
                  <label key={gender}>
                    <input
                      type="radio"
                      name="gender"
                      value={gender}
                      checked={editGender === gender}
                      onChange={(e) => setEditGender(e.target.value)}
                    />
                    {gender}
                  </label>
                ))}
              </div>
            </div>

            <div className="inner-form-filed-sec full">
              <label>Mobile Number</label>
              <input
                type="text"
                id="mobileNumber"
                value={mobileNumber}
                className="common-input-filed"
                readOnly
              />
            </div>

            <div className="inner-form-filed-sec full">
              <label>Description</label>
              <textarea
                id="description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              ></textarea>
            </div>
          </div>

          <div className="reg-sumbit-button">
            <button
              type="button"
              onClick={() => handleBusinessProfileUpdate(mobileNumber)}
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default WalletEditAstro;
