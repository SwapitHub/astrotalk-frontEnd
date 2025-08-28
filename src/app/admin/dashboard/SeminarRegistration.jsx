import DescriptionCell from '@/app/component/DescriptionCell';
import Loader from '@/app/component/Loader';
import useCustomGetApi from '@/app/hook/CustomHookGetApi';
import React, { useState } from 'react';

const SeminarRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    topic: '',
    date: '',
    time: '',
    location: '',
    email: '',
    phone: '',
    description: '',
    image: null,  // to hold the image file
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { data: seminarData } = useCustomGetApi(
    "get-seminar-list-data"
  );
  const topics = [
    "Kundli Analysis",
    "Marriage Compatibility",
    "Career Predictions",
    "Vastu Shastra",
    "Palmistry",
    "Health Astrology"
  ];

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!formData.topic) newErrors.topic = 'Topic is required.';
    if (!formData.date) newErrors.date = 'Date is required.';
    else if (new Date(formData.date) < new Date()) newErrors.date = 'Date must be in the future.';
    if (!formData.time) newErrors.time = 'Time is required.';
    if (!formData.location.trim()) newErrors.location = 'Location is required.';
    if (!formData.email.trim()) newErrors.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid.';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required.';
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone number must be 10 digits.';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    // If there are validation errors, prevent submission
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true); // Show loading indicator

    try {
      const formDataToSubmit = new FormData();
      console.log(formDataToSubmit);
      
      formDataToSubmit.append('name', formData.name);
      formDataToSubmit.append('seminar_topic', formData.topic);
      formDataToSubmit.append('date_of_seminar', formData.date);
      formDataToSubmit.append('time_of_seminar', formData.time);
      formDataToSubmit.append('location_seminar', formData.location);
      formDataToSubmit.append('email', formData.email);
      formDataToSubmit.append('mobile_number', formData.phone);
      formDataToSubmit.append('seminar_detail', formData.description);
      formDataToSubmit.append('image', formData.image);

      const response = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/post-seminar-data`, {
        method: "POST",
        body: formDataToSubmit,
      });

      const result = await response.json();
      
      if (response.ok) {
        alert('Seminar data submitted successfully!');
        // Reset form or perform other actions after success
      } else {
        alert('Error submitting seminar data: ' + result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while submitting the form.');
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  return (
    <div>
      <h2>Astrologer Seminar Invitation Form</h2>
      <div className='admin-form-box'>
      <form onSubmit={handleSubmit} noValidate>
        <div className='form-field'>
          <div className='label-content'>
            <label>Name of Astrologer:</label></div>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className='common-input-filed'/>
          {errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}
        </div>

        {/* Topic */}
        <div className='form-field'>
          <div className='label-content'><label>Seminar Topic:</label></div>
          <select className='common-input-filed' name="topic" value={formData.topic} onChange={handleChange}>
            <option value="">-- Select Topic --</option>
            {topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
          {errors.topic && <span style={{ color: 'red' }}>{errors.topic}</span>}
        </div>

        {/* Date */}
        <div className='form-field'>
          <div className='label-content'><label>Date of Seminar:</label></div>
          <input className='common-input-filed' type="date" name="date" value={formData.date} onChange={handleChange} />
          {errors.date && <span style={{ color: 'red' }}>{errors.date}</span>}
        </div>

        {/* Time */}
        <div className='form-field'>
          <div className='label-content'><label>Time:</label></div>
          <input className="common-input-filed" type="time" name="time" value={formData.time} onChange={handleChange} />
          {errors.time && <span style={{ color: 'red' }}>{errors.time}</span>}
        </div>

        <div className='form-field'>
          <div className='label-content'><label>Location:</label></div>
          <input className='common-input-filed' type="text" name="location" value={formData.location} onChange={handleChange} />
          {errors.location && <span style={{ color: 'red' }}>{errors.location}</span>}
        </div>

        <div className='form-field'>
          <div className='label-content'> <label>Contact Email:</label></div>
          <input className="common-input-filed" type="email" name="email" value={formData.email} onChange={handleChange} />
          {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
        </div>
        <div className='form-field'>
          <div className='label-content'><label>Contact Number:</label></div>
          <input className="common-input-filed" type="text" name="phone" value={formData.phone} onChange={handleChange} />
          {errors.phone && <span style={{ color: 'red' }}>{errors.phone}</span>}
        </div>

        <div className='form-field'>
          <div className='label-content'><label>Additional Details (Optional):</label></div>
          <textarea className="common-input-filed" name="description" rows="4" value={formData.description} onChange={handleChange}></textarea>
        </div>

        <div className='form-field'>
          <div className='label-content'> <label>Upload Image (Optional):</label></div>
          <input type="file" name="image" onChange={handleFileChange} />
          {formData.image && <img src={URL.createObjectURL(formData.image)} alt="Preview" style={{ maxWidth: '100px', marginTop: '10px' }} />}
        </div>

        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Send Invitation"}
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
                <tr style={{ backgroundColor: "#eee" }}>
                  <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                    Astrologer Img
                  </th>
                    <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                    Astrologer Name
                  </th>
                  <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                    Astrologer Mobile
                  </th>
                  <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                    Astrologer seminar topic
                  </th>
                  <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                    Astrologer Time and Date
                  </th>
                  <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                    Astrologer Email
                  </th>
                  <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                    Seminar Detail
                  </th>
                </tr>
              </thead>
              <tbody>
                {seminarData?.data.map((item) => (
                  <tr key={item._id}>
                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                      <img src={item?.singleImages?.img_url} alt="" />
                    </td>
                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                      {item.name}
                    </td>
                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                      {item.mobile_number}
                    </td>
                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                      {item.seminar_topic}
                    </td>
                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>                   
                      {item?.time_of_seminar} ,   {item?.date_of_seminar}                       
                    </td>
                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                      <DescriptionCell
                        description={item.seminar_detail}
                        totalWord={10}
                      />
                    </td>
                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                      <button onClick={() => handleEdit(item)}>Edit</button>
                      <button
                        style={{ marginLeft: 8 }}
                        onClick={() => handleDelete(item._id)}
                      >
                        Delete
                      </button>
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
