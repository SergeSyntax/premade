export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    email: string;
    allowExtraEmails: boolean;
    createdAt: Date;
    updatedAt: Date;
    id: string;
  };
}
