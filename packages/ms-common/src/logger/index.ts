import { RequestHandler } from "express";

import * as env from "../config";
import { Env, LevelType } from "../enums";
import { MORGAN_TAG } from "./config";
import { getTag, isLogLevelProperty } from "./helpers";
import { createHTTPLogMiddleware } from "./morgan";
import { CustomLogger } from "./types";
import { createWinstonLogger } from "./winston";

const winstonLogger = createWinstonLogger({
  createLogFile: Boolean(env.WRITE_LOG_FILE),
  isJSONFormat: Boolean(env.LOG_AS_JSON),
  level: env.LOG_LEVEL,
});

export const logger: CustomLogger = new Proxy(winstonLogger, {
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

const isMorganDisabled = env.NODE_ENV === Env.Test;

export const httpLogMiddleware: RequestHandler = createHTTPLogMiddleware(logger, isMorganDisabled);
