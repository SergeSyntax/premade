import { StatusCodes } from "http-status-codes";

import { ParsedError } from "../types";
import { CustomError } from "./custom.error";

export class BadRequestError extends CustomError {
  statusCode = StatusCodes.BAD_REQUEST;

  constructor(public message: string) {
    super(message);

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors(): ParsedError[] {
    return [{ message: this.message }];
  }
}
