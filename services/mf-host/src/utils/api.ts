import { ServerError } from "@/types";
import { HttpStatusCode } from "axios";

export const isValidationError = (error: ServerError) => {
  const status = error?.response?.status ?? 0;

  return status >= HttpStatusCode.BadRequest && status < HttpStatusCode.InternalServerError;
};

export const getValidationMessage = (error: ServerError) => {
  return error.response?.data.errors[0].message;
};
