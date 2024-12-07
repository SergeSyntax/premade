import Joi from "joi";

export const text = Joi.string().min(3).max(255);
export const enumeration = (enumeration: object) => text.valid(...Object.values(enumeration));
