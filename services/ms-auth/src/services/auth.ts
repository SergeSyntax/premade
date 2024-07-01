import { BadRequestError } from "@devops-premade/ms-common";

import { User } from "../models/user";
import { LoginReqBody, RegisterReqBody } from "../types";
import { Password } from "../utils/password";

export const searchEmailService = async (email: string) => {
  const existingUser = await User.findOne({ email });

  return existingUser;
};

export const isEmailAvilableService = async (email: string) => {
  const existingUser = await searchEmailService(email);

  if (existingUser) throw new BadRequestError("this email already in use");
};

export const loginService = async ({ email, password }: LoginReqBody) => {
  const existingUser = await searchEmailService(email);
  if (!existingUser) throw new BadRequestError("Invalid credentials");

  const passwordMatch = await Password.compare(existingUser.password, password);
  if (!passwordMatch) throw new BadRequestError("Invalid credentials");

  return existingUser;
};

export const registerService = async ({ email, password }: RegisterReqBody) => {
  const existingUser = await searchEmailService(email);
  if (existingUser) throw new BadRequestError("user already exists");

  const newUser = new User({ email, password });
  await newUser.save();

  return newUser;
};
