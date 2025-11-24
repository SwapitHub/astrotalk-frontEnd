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
      <div className="astrologer-profile-edit-table wallet-edit-main">
        <span
          className="close"
          onClick={() => {
            setAddActiveClassEdit(false);
          }}
        >
          X
        </span>
        <div className="profile-table">
          <div className="inner-profile-table">
            <div className="common-profile">
              <div className="common-img">Upload Image</div>
              <div className="input-outer">
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
                <div className="add-profile-content">
                  <div className="inner-form-filed-sec full">
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
            </div>

            <div className="common-profile">
              <div className="name">Name</div>
              <div className="input-outer">
                <input
                  type="text"
                  id="fname"
                  className="common-input-filed"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="common-profile">
              <div className="Experience">Experience</div>
              <div className="input-outer">
                <input
                  type="text"
                  id="Experience"
                  className="common-input-filed"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                />
              </div>
            </div>

            <div className="common-profile">
              <div className="Skills">Skills</div>
              <div className="man-input-filed-sec input-outer">
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

            <div className="common-profile">
              <div className="Languages">Languages</div>
              <div className="man-input-filed-sec input-outer">
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

            <div className="common-profile">
              <div className="Charges">Charges</div>
              <div className="input-outer">
                <input
                  type="text"
                  id="Charges"
                  className="common-input-filed"
                  value={editCharges}
                  onChange={(e) => setEditCharges(e.target.value)}
                />
              </div>
            </div>

            <div className="common-profile">
              <div className="Country">Country</div>
              <div className="man-input-filed-sec input-outer">
                <label>
                  <input
                    type="radio"
                    name="country"
                    value="India"
                    checked={editCountry === "India"}
                    onChange={(e) => setEditCountry(e.target.value)}
                  />
                  <label>India</label>
                </label>
                <label>
                  <input
                    type="radio"
                    name="country"
                    value="Outside_India"
                    checked={editCountry === "Outside_India"}
                    onChange={(e) => setEditCountry(e.target.value)}
                  />
                  <label>Outside India</label>
                </label>
              </div>
            </div>

            <div className="common-profile">
              <div className="gender">Gender</div>
              <div className="man-input-filed-sec input-outer">
                {["Male", "Female", "Other"].map((gender) => (
                  <>
                    <label key={gender}>
                      <input
                        type="radio"
                        name="gender"
                        value={gender}
                        checked={editGender === gender}
                        onChange={(e) => setEditGender(e.target.value)}
                      />
                      <label>{gender}</label>
                    </label>
                  </>
                ))}
              </div>
            </div>

            <div className="common-profile">
              <div className="mobile">Mobile Number</div>
              <div className="input-outer">
                <input
                  type="text"
                  id="mobileNumber"
                  value={mobileNumber}
                  className="common-input-filed"
                  readOnly
                />
              </div>
            </div>

            <div className="common-profile">
              <div className="Description">Description</div>
              <div className="input-outer">
                <textarea
                  className="common-input-filed"
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
          </div>
        </div>
      </div>
    </>
  );
};

export default WalletEditAstro;
