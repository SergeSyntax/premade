import { StatusCodes } from "http-status-codes";

import { CustomError } from "./custom.error";



export class NotAuthorizedError extends CustomError {
  statusCode = StatusCodes.UNAUTHORIZED;
  static message = "Not authorized";

  constructor() {
    super(NotAuthorizedError.message);

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors(): { message: string; field?: string | undefined }[] {
    return [{ message: this.message }];
  }
}
