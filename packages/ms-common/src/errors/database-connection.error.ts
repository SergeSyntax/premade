import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { ValidationError } from "joi";

import { CustomError } from "./custom.error";

// TODO: refactor should handle more then just db connection
export class DatabaseConnectionError extends CustomError {
  statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  //  TODO: why do we even need that?
  reason = "Error connecting to mongodb";

  constructor() {
    super("Invalid request parameters");

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [{ message: ReasonPhrases.INTERNAL_SERVER_ERROR }];
  }
}
