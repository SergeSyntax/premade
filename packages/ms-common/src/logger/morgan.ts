import ecsMorganFormat from "@elastic/ecs-morgan-format";
import { RequestHandler } from "express";
import morgan from "morgan";

import { formatMorganMessage } from "./format";
import { CustomLogger } from "./types";

export type CreateHTTPLogMiddleware = (
  logger: CustomLogger,
  isMorganDisabled: boolean,
) => RequestHandler;

export const createHTTPLogMiddleware: CreateHTTPLogMiddleware = (logger, isMorganDisabled) => {
  if (isMorganDisabled) return (_req, _res, next) => next();
  return morgan(
    ecsMorganFormat({
      // https://www.elastic.co/guide/en/ecs-logging/nodejs/current/morgan.html#morgan-format-options
      format: "combined",
    }),
    {
      stream: {
        write: (message) => logger.http(formatMorganMessage(message)),
      },
    },
  );
};
