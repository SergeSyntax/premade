import { StatusCodes } from "http-status-codes";
import { ValidationError } from "joi";

import { CustomError } from "./custom.error";

export class RequestValidationError extends CustomError {
  statusCode = StatusCodes.BAD_REQUEST;

  constructor(public error: ValidationError) {
    super("Invalid request parameters");

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.error.details.map(({ message, path }) => ({ message, field: path[0] + "" }));
  }
}
