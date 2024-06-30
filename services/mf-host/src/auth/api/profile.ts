import { User } from "../types";
import { authService } from "./authService";

interface UserResponse {
  user: User | null;
}

export const getProfile = () => authService.get<UserResponse>("/current-user");
