
import { RequestHandler } from "express";
import morgan from "morgan";
import ecsMorganFormat from "@elastic/ecs-morgan-format";
import { CustomLogger } from "./types";
import { formatMorganMessage } from "./format";

export type CreateHTTPLogMiddleware = (logger: CustomLogger, disableMorgan: boolean) => RequestHandler

export const createHTTPLogMiddleware: CreateHTTPLogMiddleware = (logger, disableMorgan) => {
  if (disableMorgan) return (_req, _res, next) => next();
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
