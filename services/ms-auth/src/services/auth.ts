import { LoginReqBody, RegisterReqBody } from "../types";
import { User } from "../models/user";
import { BadRequestError } from "../lib/http-error";
import { Password } from "../utils/password";

const loginService = async ({ email, password }: LoginReqBody) => {
  const existingUser = await User.findOne({ email });
  if (!existingUser) throw new BadRequestError("Invalid credentials");

  const passwordMatch = await Password.compare(existingUser.password, password);
  if (!passwordMatch) throw new BadRequestError("Invalid credentials");

  return existingUser;
};

const registerService = async ({ email, password }: RegisterReqBody) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) throw new BadRequestError('user already exists');

  const newUser = new User({ email, password });
  await newUser.save();

  return newUser
}

export { loginService, registerService }
