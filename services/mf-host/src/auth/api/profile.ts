import { authService } from "./authService";

export const getProfile = () => authService.get('/current-user')
