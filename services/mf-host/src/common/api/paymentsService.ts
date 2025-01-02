import axios from "axios";

export const paymentsService = axios.create({
  // baseURL: `${import.meta.env.BASE_URL}/api`,
  baseURL: `http://localhost:5004/api/payments`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
