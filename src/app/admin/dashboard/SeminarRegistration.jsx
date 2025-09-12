import Loader from "@/app/component/Loader";
import ShowLessShowMore from "@/app/component/ShowLessShowMore";
import useCustomGetApi from "@/app/hook/CustomHookGetApi";
import axios from "axios";
import { useState } from "react";
import { MdDelete, MdEditSquare } from "react-icons/md";

const SeminarRegistration = () => {
  const [formData, setFormData] = useState({
    name: "",
    topic: "",
    date: "",
    time: "",
    location: "",
    email: "",
    phone: "",
    description: "",
    seminar_status: "",
    seminar_link: "",
    image: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false); // New state to track edit mode
  const [editingSeminarId, setEditingSeminarId] = useState(null);
  const { data: seminarData, fetchGetData } = useCustomGetApi(
    "get-seminar-list-data"
  );
  const topics = [
    "Kundli Analysis",
    "Marriage Compatibility",
    "Career Predictions",
    "Vastu Shastra",
    "Palmistry",
    "Health Astrology",
  ];
  const handleEdit = (seminar) => {
    setFormData({
      name: seminar.name,
      topic: seminar.seminar_topic,
      date: seminar.date_of_seminar,
      time: seminar.time_of_seminar,
      location: seminar.location_seminar,
      email: seminar.email,
      phone: seminar.mobile_number,
      description: seminar.seminar_detail,
      seminar_status: seminar.seminar_status,
      seminar_link: seminar.seminar_link,
      image: seminar?.singleImages?.img_url, // You may want to handle image here
    });
    setEditMode(true);
    setEditingSeminarId(seminar._id); // Save the ID of the seminar being edited
  };
  const validate = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = "Name is required.";
    if (!formData.topic) newErrors.topic = "Topic is required.";
    if (!formData.seminar_link)
      newErrors.seminar_link = "seminar_link is required.";
    if (!formData.date) newErrors.date = "Date is required.";
    // else if (new Date(formData.date) < new Date())
    //   newErrors.date = "Date must be in the future.";
    if (!formData.time) newErrors.time = "Time is required.";
    if (!formData.location?.trim())
      newErrors.location = "Location is required.";
    if (!formData.email?.trim()) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid.";
    if (!formData.phone?.trim()) newErrors.phone = "Phone number is required.";
    else if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Phone number must be 10 digits.";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "time") {
      // Convert to 12-hour format with AM/PM
      const timeParts = value.split(":");
      let hours = parseInt(timeParts[0], 10);
      const minutes = timeParts[1];
      const period = hours >= 12 ? "PM" : "AM";
      hours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours; // Adjust hours to 12-hour format
      const formattedTime = `${hours}:${minutes} ${period}`;
      setFormData((prev) => ({ ...prev, time: formattedTime }));
    }
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("name", formData.name);
    formDataToSubmit.append("seminar_topic", formData.topic);
    formDataToSubmit.append("seminar_link", formData.seminar_link);
    formDataToSubmit.append("seminar_status", formData.seminar_status);
    formDataToSubmit.append("date_of_seminar", formData.date);
    formDataToSubmit.append("time_of_seminar", formData.time);
    formDataToSubmit.append("location_seminar", formData.location);
    formDataToSubmit.append("email", formData.email);
    formDataToSubmit.append("mobile_number", formData.phone);
    formDataToSubmit.append("seminar_detail", formData.description);
    if (formData.image) formDataToSubmit.append("image", formData.image);

    try {
      let response;
      if (editMode) {
        // Update existing seminar
        response = await fetch(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}/put-seminar-list-data/${editingSeminarId}`,
          {
            method: "PUT",
            body: formDataToSubmit,
          }
        );
      } else {
        // Create new seminar
        response = await fetch(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}/post-seminar-data`,
          {
            method: "POST",
            body: formDataToSubmit,
          }
        );
      }

      const result = await response.json();
      if (response.ok) {
        fetchGetData(); // Refresh seminar list
        setFormData({
          name: "",
          topic: "",
          date: "",
          time: "",
          location: "",
          email: "",
          phone: "",
          description: "",
          seminar_link: "",
          seminar_status: "",
          image: null,
        });
        setEditMode(false); // Reset edit mode after submission
        setEditingSeminarId(null); // Reset editing seminar ID
      } else {
        console.log("Error:", result.error);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (deleteId) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/delete-seminar-list-data/${deleteId}`
      );
      console.log(response, "deleteId response");
      if (response.status == 200) {
        fetchGetData();
      }
    } catch (err) {
      console.log("error", err);
    }
  };
  return (
    <div className="seminar-reg-outer">
      <h2>Astrologer Seminar Invitation Form</h2>
      <div className="admin-form-box">
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <div className="label-content">
              <label>Name of Astrologer:</label>
            </div>
            <input
              type="text"
              name="name"
              value={formData?.name}
              onChange={handleChange}
              className="common-input-filed"
            />
            {errors.name && <span style={{ color: "red" }}>{errors.name}</span>}
          </div>

          {/* Topic */}
          <div className="form-field">
            <div className="label-content">
              <label>Seminar Topic:</label>
            </div>
            <select
              className="common-input-filed"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
            >
              <option value="">-- Select Topic --</option>
              {topics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
            {errors.topic && (
              <span style={{ color: "red" }}>{errors.topic}</span>
            )}
          </div>

          {/* Date */}
          <div className="form-field">
            <div className="label-content">
              <label>Date of Seminar:</label>
            </div>
            <input
              className="common-input-filed"
              type="date"
              name="date"
              onChange={handleChange}
              value={formData?.date}
            />
            {errors.date && <span style={{ color: "red" }}>{errors.date}</span>}
          </div>

          {/* Time */}
          <div className="form-field">
            <div className="label-content">
              <label>Time:</label>
            </div>
            <input
              className="common-input-filed"
              type="time"
              name="time"
              onChange={handleChange}
              value={formData.time.split(" ")[0] || ""}
            />
            {errors.time && <span style={{ color: "red" }}>{errors.time}</span>}
          </div>

          <div className="form-field">
            <div className="label-content">
              <label>Location:</label>
            </div>
            <input
              className="common-input-filed"
              type="text"
              name="location"
              onChange={handleChange}
              value={formData?.location}
            />
            {errors.location && (
              <span style={{ color: "red" }}>{errors.location}</span>
            )}
          </div>

          <div className="form-field">
            <div className="label-content">
              {" "}
              <label>Contact Email:</label>
            </div>
            <input
              className="common-input-filed"
              type="email"
              name="email"
              onChange={handleChange}
              value={formData?.email}
            />
            {errors.email && (
              <span style={{ color: "red" }}>{errors.email}</span>
            )}
          </div>
          <div className="form-field">
            <div className="label-content">
              <label>Contact Number:</label>
            </div>
            <input
              className="common-input-filed"
              type="text"
              name="phone"
              onChange={handleChange}
              value={formData?.phone}
            />
            {errors.phone && (
              <span style={{ color: "red" }}>{errors.phone}</span>
            )}
          </div>
          <div className="form-field">
            <div className="label-content">
              <label>
                Add Seminar Link:{" "}
                (Zoom / Google Meet)
              </label>
            </div>
            <input
              className="common-input-filed"
              type="text"
              name="seminar_link"
              onChange={handleChange}
              value={formData?.seminar_link}
              placeholder="Add here seminar link"
            />
            {errors.phone && (
              <span style={{ color: "red" }}>{errors.seminar_link}</span>
            )}
          </div>
          <div className="form-field">
            <div className="label-content">
              <label>Additional Details (Optional):</label>
            </div>
            <textarea
              className="common-input-filed"
              name="description"
              rows="4"
              onChange={handleChange}
              value={formData?.description}
            ></textarea>
          </div>

          <div className="form-field">
            <div className="label-content">
              {" "}
              <label>Upload Image (Optional):</label>
            </div>
            <input type="file" name="image" onChange={handleFileChange} />
            {/* {console.log(formData?.image.name )
            } */}
            {formData?.image && (
              <img
                src={
                  formData?.image?.name
                    ? URL.createObjectURL(formData?.image)
                    : formData?.image
                }
                alt="Preview"
                style={{ maxWidth: "100px", marginTop: "10px" }}
              />
            )}
          </div>
          <div className="form-field field-checkbox man-input-filed-sec">
            <label>
              <input
                type="checkbox"
                name="seminar_status"
                checked={formData.seminar_status}
                onChange={handleChange}
              />
              <span>Show seminar banner on Home page</span>
            </label>
          </div>
          <button type="submit" disabled={loading}>
            {loading
              ? "Submitting..."
              : editMode
                ? "Update Seminar"
                : "Send Invitation"}
          </button>


        </form>
      </div>

      <h2>Seminar All Astrologer Data</h2>

      {loading ? (
        <Loader />
      ) : seminarData.length === 0 ? (
        <p>No Data found.</p>
      ) : (
        <>
          <div className="outer-table">
            <table
              className="seo-table"
              style={{ width: "100%", borderCollapse: "collapse" }}
            >
              <thead>
                <tr>
                  <th>
                    Astrologer Img
                  </th>
                  <th>
                    Astrologer Name
                  </th>
                  <th>
                    Astrologer Mobile
                  </th>
                  <th>
                    Astrologer seminar topic
                  </th>
                  <th>
                    Astrologer Time and Date
                  </th>
                  <th>
                    Astrologer Detail
                  </th>
                  <th>
                    Seminar Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {seminarData?.data.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <img src={item?.singleImages?.img_url} alt="" />
                    </td>
                    <td>
                      {item.name}
                    </td>
                    <td>
                      {item.mobile_number}
                    </td>
                    <td>
                      {item.seminar_topic}
                    </td>
                    <td>
                      {item?.time_of_seminar} , {item?.date_of_seminar}
                    </td>
                    <td>
                      <ShowLessShowMore
                        description={item.seminar_detail}
                        totalWord={10}
                      />
                    </td>
                    <td>
                      <div className="edit-delete-btn">
                      <button onClick={() => handleEdit(item)}><MdEditSquare /></button>
                      <button
                        style={{ marginLeft: 8 }}
                        onClick={() => handleDelete(item._id)}
                      >
                       <MdDelete />
                      </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* {totalPages > 0 && (
            <div
              style={{
                marginTop: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <button
                onClick={() => fetchSeoData(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => fetchSeoData(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )} */}
        </>
      )}
    </div>
  );
};

export default SeminarRegistration;
