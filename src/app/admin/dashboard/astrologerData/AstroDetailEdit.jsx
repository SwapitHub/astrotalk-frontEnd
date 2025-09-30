import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import secureLocalStorage from "react-secure-storage";
import Cookies from "js-cookie";
import Image from "next/image";

const AstroDetailEdit = ({
  astroMobileNumber,
  setAddActiveClassEdit,
  setLoading,
  checkCompleteProfile,
}) => {
  const [astrologerPhone, setAstrologerPhone] = useState("");
  const [astroUpdateDetail, setAstroUpdateDetail] = useState({});
  const [professionsList, setProfessionsList] = useState([]);
  const [languageListData, setLanguageListData] = useState([]);
  const [loader, setLoader] = useState(false);
console.log(checkCompleteProfile,"checkCompleteProfile");

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

  useEffect(() => {
    const phone = Cookies.get("astrologer-phone");
    setAstrologerPhone(phone);
  }, []);

  useEffect(() => {
    // if (!astrologerPhone) return;

    axios
      .get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/astrologer-businessProfile-detail/${astroMobileNumber}`
      )
      .then((res) => {
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
      })
      .catch((err) => console.error(err));
  }, [astroMobileNumber]);

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

    setLoader(true);

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/astrologer-businessProfile-update/${astroMobileNumber}`,
        updateData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.message === "success") {
        toast.success("Profile updated successfully");
      }
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Update failed");
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      <div className="astrologer-profile-edit-table">
        <span
          className="close"
          onClick={() => {
            setAddActiveClassEdit(false);
          }}
        >
          X
        </span>
        <h2>Astrologer Profile (Editable)</h2>
        <div className="outer-table">
          {
            checkCompleteProfile ? <table className="profile-table" border="1" cellPadding="10">
            <thead>
              <tr>
                <th>Upload Image</th>
                <th>Name</th>
                <th>Experience</th>
                <th>Charges</th>
                <th>Gender</th>
                <th>Country</th>
                <th>Languages</th>
                <th>Professions</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
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
                  <input type="file" id="image" name="image" />
                </td>
                <td>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </td>

                <td>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                  />
                </td>

                <td>
                  <input
                    type="text"
                    name="charges"
                    value={formData.charges}
                    onChange={handleChange}
                  />
                </td>

                <td>
                  {["Male", "Female", "Other"].map((g) => (
                    <label key={g}>
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={formData.gender === g}
                        onChange={handleChange}
                      />
                      {g}
                    </label>
                  ))}
                </td>

                <td>
                  {["India", "Outside_India"].map((c) => (
                    <label key={c}>
                      <input
                        type="radio"
                        name="country"
                        value={c}
                        checked={formData.country === c}
                        onChange={handleChange}
                      />
                      {c === "India" ? "India" : "Outside India"}
                    </label>
                  ))}
                </td>

                <td>
                  {languageListData.map((lang) => (
                    <label key={lang._id}>
                      <input
                        type="checkbox"
                        name="languages"
                        value={lang.languages}
                        checked={formData.languages.includes(lang.languages)}
                        onChange={(e) => handleCheckboxChange(e, "languages")}
                      />
                      {lang.languages}
                    </label>
                  ))}
                </td>

                <td>
                  {professionsList.map((prof) => (
                    <label key={prof._id}>
                      <input
                        type="checkbox"
                        name="professions"
                        value={prof.professions}
                        checked={formData.professions.includes(
                          prof.professions
                        )}
                        onChange={(e) => handleCheckboxChange(e, "professions")}
                      />
                      {prof.professions}
                    </label>
                  ))}
                </td>

                <td>
                  <textarea
                    name="description"
                    rows="4"
                    cols="30"
                    value={formData.description}
                    onChange={handleChange}
                  ></textarea>
                </td>
              </tr>
            </tbody>
          </table> : <p>Astrologer Profile is not completed</p>
          }
          
        </div>
        <div>
          <button onClick={handleUpdate}>Update Profile</button>
        </div>
      </div>
    </>
  );
};

export default AstroDetailEdit;
