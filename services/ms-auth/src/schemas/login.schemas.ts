import Joi from "joi";

import { LoginReqBody } from "../types";

const text = Joi.string().min(3).max(255);
const email = text.email().lowercase().required();
const password = Joi.string().min(5).max(255).required();

export const loginBodySchema = Joi.object<LoginReqBody>({
  email,
  password,
});

export const registerBodySchema = Joi.object<LoginReqBody>({
  email,
  password,
  firstName: text,
  lastName: text,
  allowExtraEmails: Joi.bool(),
});

export const verifyEmailSchema = Joi.object({
  email,
});
