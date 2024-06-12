import { LoginPayload, LoginResponse } from "../types/login";
import { authService } from "./authService";

export const postLogin = (loginPayload: LoginPayload) =>
  authService.post<LoginResponse>("/login", loginPayload);
