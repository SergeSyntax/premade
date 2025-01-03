import { StatusCodes } from "http-status-codes";

import { ParsedError } from "#src/types";

export abstract class CustomError extends Error {
  abstract statusCode: StatusCodes;

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): ParsedError[];
}
