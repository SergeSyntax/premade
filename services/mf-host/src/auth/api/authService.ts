import axios from "axios";

export const authService = axios.create({
  // baseURL: `${import.meta.env.BASE_URL}/api`,
  baseURL: `http://localhost:5000/api/auth`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
