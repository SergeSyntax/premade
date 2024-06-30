import { authService } from "./authService";

export const postLogout = () => authService.post("/logout");
