import Joi from "joi";
import { LoginReqBody } from "../types";

const loginBodySchema = Joi.object<LoginReqBody>({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(5).required(),
})

const registerBodySchema = Joi.object<LoginReqBody>({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(5).required(),
})

export { loginBodySchema, registerBodySchema }