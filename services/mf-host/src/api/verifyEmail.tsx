import axiosInstance from "./axiosInstance";

export const verifyEmail = async (email: string) => {
  return await axiosInstance.post("/auth/email", { email });
};
