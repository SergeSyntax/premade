import { StatusCodes } from "http-status-codes";

import { CustomError } from "./custom.error";

export class ValidationError extends CustomError {
  statusCode = StatusCodes.BAD_REQUEST;

  constructor(
    public field: string,
    public message: string,
  ) {
    super("Invalid request parameters");

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, ValidationError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message, field: this.field }];
  }
}
