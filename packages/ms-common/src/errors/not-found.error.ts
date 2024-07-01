import { ReasonPhrases,StatusCodes } from "http-status-codes";

import { CustomError } from "./custom.error";

export class NotFoundError extends CustomError {
  statusCode = StatusCodes.NOT_FOUND;

  constructor(private entityName?: string) {
    super("Route not found");

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: `${this.entityName ?? "route"} ${ReasonPhrases.NOT_FOUND.toLowerCase()}` }];
  }
}
