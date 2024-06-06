export interface LoginReqBody {
  email: string;
  password: string;
}


export interface RegisterReqBody extends LoginReqBody {}
