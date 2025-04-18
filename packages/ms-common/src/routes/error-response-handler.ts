import ErrorStackParser from "error-stack-parser";
import { ErrorRequestHandler } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { CustomError } from "#src/errors";
import { logger } from "#src/logger";

interface HttpError extends Error {
  status?: number;
}

export const errorRequestHandler: ErrorRequestHandler = (err: HttpError, _req, res, _next) => {
  if (err instanceof CustomError)
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });

  logger.error(err, ErrorStackParser.parse(err));

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
    errors: [{ message: ReasonPhrases.INTERNAL_SERVER_ERROR }],
  });
};
