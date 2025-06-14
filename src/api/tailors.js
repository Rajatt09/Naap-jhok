import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const getNearbyTailors = async (lat, lng, radius = 4) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/tailors/nearby?lat=${lat}&lng=${lng}&radius=${radius}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch nearby tailors"
    );
  }
};

export const getAllTailors = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/tailors`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch tailors");
  }
};

export const getTailorById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/api/tailors/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch tailor");
  }
};

export const getTailorLocation = async () => {
  console.log("called");
  try {
    const response = await axios.get(
      `${API_URL}/api/tailors/location`,
      getAuthHeaders()
    );
    // console.log("data is : ", response.data);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch location"
    );
  }
};

export const saveTailorLocation = async (location) => {
  try {
    // location: { lat: ..., lng: ... }
    // console.log("called : ", location);
    const response = await axios.put(
      `${API_URL}/api/tailors/profile`,
      { location },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to save location");
  }
};

export const updateTailorProfile = async (profileData) => {
  try {
    const response = await axios.put(
      `${API_URL}/api/tailors/profile`,
      profileData,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update profile"
    );
  }
};
