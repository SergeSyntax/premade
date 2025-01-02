import axios from "axios";

export const donationService = axios.create({
  // baseURL: `${import.meta.env.BASE_URL}/api`,
  baseURL: `http://localhost:5002/api/donations`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
