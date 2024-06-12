export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  allowExtraEmails: boolean;
}

export interface RegisterResponse {
  user: {
    email: string;
    allowExtraEmails: boolean;
    createdAt: Date;
    updatedAt: Date;
    id: string;
  };
}
