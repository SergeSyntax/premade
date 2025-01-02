import axios from "axios";

export const mediaService = axios.create({
  // baseURL: `${import.meta.env.BASE_URL}/api`,
  baseURL: `http://localhost:5001/api/media`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
