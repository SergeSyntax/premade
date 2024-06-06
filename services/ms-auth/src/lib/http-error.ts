import { ValidationError } from "joi";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

interface ParsedError {
  message: string;
  field?: string;
}

export interface ErrorHandlerResponse {
  errors: ParsedError[];
}

export abstract class CustomError extends Error {
  abstract statusCode: StatusCodes;

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): ParsedError[];
}

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

export class BadRequestError extends CustomError {
  statusCode = StatusCodes.BAD_REQUEST;

  constructor(public message: string) {
    super(message);

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors(): ParsedError[] {
    return [{ message: this.message }];
  }
}

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

export class DatabaseConnectionError extends CustomError {
  statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  reason = "Error connecting to mongodb";

  constructor(public error: ValidationError) {
    super("Invalid request parameters");

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return [{ message: ReasonPhrases.INTERNAL_SERVER_ERROR }];
  }
}

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
