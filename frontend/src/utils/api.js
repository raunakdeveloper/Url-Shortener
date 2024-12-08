import axios from "axios";
import { getToken } from "./localStorage";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Add a req interceptor auth token
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// sign in using Google
export const googleSignIn = async (idToken) => {
  try {
    const response = await api.post("/auth/google-signin", { idToken });
    return response.data; // { user, token }
  } catch (error) {
    console.error("Error during Google sign-in", error);
    throw error;
  }
};

// create a short URL
export const shortenUrl = async (longUrl) => {
  try {
    const response = await api.post("/urls", { longUrl });
    return response.data;
  } catch (error) {
    console.error("Error creating short URL", error);
    throw error;
  }
};

// fetch user URLs
export const getUserUrls = async () => {
  try {
    const response = await api.get("/urls");
    return response.data;
  } catch (error) {
    console.error("Error fetching user URLs", error);
    throw error;
  }
};

// delete a specific URL
export const deleteUrl = async (id) => {
  try {
    const response = await api.delete(`/urls/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting URL with id ${id}`, error);
    throw error;
  }
};

// fetch the user's profile (example endpoint)
export const getUserProfile = async () => {
  try {
    const response = await api.get("/users/profile");
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile", error);
    throw error;
  }
};

// redirect to real url
export const redirectToLongUrl = async (shortCode) => {
  try {
    const response = await api.get(`/${shortCode}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching long URL", error);
    throw error;
  }
};

export default api;
