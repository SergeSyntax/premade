import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: `${import.meta.env.BASE_URL}/api`,
  baseURL: `http://localhost:5000/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
