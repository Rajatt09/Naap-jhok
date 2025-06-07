import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, credentials);
    const { token, user } = response.data;
    localStorage.setItem("token", token);
    return { user, token };
  } catch (error) {
    // console.error("Login error:", error);
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

export const signup = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/signup`, userData);
    const { token, user } = response.data;
    localStorage.setItem("token", token);
    return { user, token };
  } catch (error) {
    throw new Error(error.response?.data?.message || "Signup failed");
  }
};

export const fetchCurrentUser = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const response = await axios.get(`${API_URL}/api/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch user");
  }
};

export const updateProfile = async (userData, userId) => {
  try {
    console.log("Updating profile for user:", userId, userData, API_URL);
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_URL}/api/users/profile`, userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update profile"
    );
  }
};
