import { getValidationMessage, isValidationError } from "@/utils/api";
import { RegisterPayload, RegisterResponse } from "../types/register";
import { authService } from "./authService";
import { ServerError } from "@/types";

export const postEmail = async (email: string) => {
  return await authService.post<string>("/email", { email });
};

export const verifyEmail = async (email: string) => {
  try {
    await postEmail(email);
    return null;
  } catch (err) {
    const error = err as ServerError;
    return isValidationError(error) ? getValidationMessage(error) : null;
  }
};

export const postRegister = (registerPayload: RegisterPayload) =>
  authService.post<RegisterResponse>("/register", registerPayload);
