export interface LoginReqBody {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  allowExtraEmails?: boolean;
}

export interface RegisterReqBody {
  email: string;
  password: string;
}
