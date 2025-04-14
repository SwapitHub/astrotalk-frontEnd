import axios from "axios";
import secureLocalStorage from "react-secure-storage";
const API_BASE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL;
const userMobile = Math.round(secureLocalStorage.getItem("userMobile"));

// Common GET request function
const getRequest = async (endpoint) => {
  try {
    const response = await axios.get(`${API_BASE_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
};


// Common POST request function
const postRequest = async (endpoint, data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}${endpoint}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error posting to ${endpoint}:`, error);
    throw error;
  }
};

// Define specific API calls using the common functions
export const fetchAstrologerProfile = () => getRequest("/astrologer-businessProfile");
export const fetchUserLoginDetails = () => getRequest(`/auth/user-login-detail/${userMobile}`);
export const createBooking = (bookingData) => postRequest("/bookings", bookingData);
export const updateProfile = (userId, profileData) => postRequest(`/users/${userId}/update`, profileData);
