import * as Yup from "yup";

export const EMAIL_VALIDATION_MESSAGE = "this must be a valid email";

export const textSchema = Yup.string().min(3).max(255).required();
export const passwordSchema = Yup.string().min(5).max(255).required();
export const emailSchema = textSchema.email().lowercase().required().strict();
