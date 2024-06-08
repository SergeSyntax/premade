import Joi from "joi";
import { LoginReqBody } from "../types";

export const loginBodySchema = Joi.object<LoginReqBody>({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(5).required(),
});

export const registerBodySchema = Joi.object<LoginReqBody>({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(5).required(),
});

export const verifyEmailSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
});
