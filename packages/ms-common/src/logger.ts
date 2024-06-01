import winston from "winston";
import { formatLogMessage, formatMorganMessage } from "./format";
import {
  levels,
  MAX_SIZE,
  TIMESTAMP_FORMAT,
  ALL_FILENAME_LOGS_PATH,
  ALL_FILENAME_LOGS_LEVEL,
  ERROR_FILENAME_LOGS_PATH,
  ERROR_FILENAME_LOGS_LEVEL,
  colors,
  LevelType,
  MORGAN_TAG,
  Env,
  LogType,
} from "./config.js";
import { getTag, isLogLevelProperty } from "./helpers";
import { RequestHandler } from "express";
import morgan from "morgan";
import ecsMorganFormat from "@elastic/ecs-morgan-format";
import { CustomLogger } from "./types";

const { File, Console } = winston.transports;
const { printf, colorize, combine, timestamp } = winston.format;

export interface LogEnvVars extends NodeJS.ProcessEnv {
  LOG_LEVEL?: LevelType;
  NODE_ENV: Env;
  LOG_TYPE?: LogType;
}

export const createLogger = ({
  LOG_LEVEL = LevelType.DEBUG,
  NODE_ENV = Env.Development,
  LOG_TYPE = LogType.DEFAULT,
}: LogEnvVars) => {
  const isDevelopmentEnv = NODE_ENV === Env.Development;
  const isTestEnv = NODE_ENV === Env.Test;
  const isLogTypeJSON = LOG_TYPE === LogType.JSON;

  const printFormat = printf(formatLogMessage(isLogTypeJSON));
  const format = isLogTypeJSON
    ? combine(timestamp(), printFormat)
    : combine(colorize({ level: true }), printFormat);

  const consoleTransport = new Console({
    level: LOG_LEVEL,
    format,
  });

  const commonFileOptions: winston.transports.FileTransportOptions = {
    maxsize: MAX_SIZE,
    format: combine(timestamp({ format: TIMESTAMP_FORMAT }), printFormat),
  };
  const fileTransporters = isDevelopmentEnv
    ? [
        new File({
          ...commonFileOptions,
          filename: ALL_FILENAME_LOGS_PATH,
          level: ALL_FILENAME_LOGS_LEVEL,
        }),
        new File({
          ...commonFileOptions,
          filename: ERROR_FILENAME_LOGS_PATH,
          level: ERROR_FILENAME_LOGS_LEVEL,
        }),
      ]
    : [];

  winston.addColors(colors);

  const winstonLogger = winston.createLogger({
    levels,
    format: winston.format.errors({ stack: true }),
    transports: [consoleTransport, ...fileTransporters],
  });

  const logger: CustomLogger = new Proxy(winstonLogger, {
    get: function (target, property) {
      if (isLogLevelProperty(property)) {
        return (message: unknown, ...rest: unknown[]) => {
          if (message instanceof Error) return target[property](getTag(), message);
          if (property === LevelType.HTTP) return target[property]([MORGAN_TAG, message, ...rest]);
          return target[property]([getTag(), message, ...rest]);
        };
      }
      return target[property];
    },
  });

  const logHTTPRequests = (): RequestHandler => {
    if (isTestEnv) return (_req, _res, next) => next();
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

  return { logger, logHTTPRequests };
};
