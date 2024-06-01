import { MORGAN_TAG } from "./config";
import { getTag, isLogLevelProperty } from "./helpers";
import { createWinstonLogger } from "./winston";
import { createHTTPLogMiddleware } from "./morgan";
import { CreateLogger, CustomLogger } from "./types";
import { LevelType } from "../types/index";

export const createLogger: CreateLogger = ({ disableMorgan = false, ...winstonConfiguration }) => {
  const winstonLogger = createWinstonLogger(winstonConfiguration);

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

  const httpLogMiddleware = createHTTPLogMiddleware(logger, disableMorgan);

  return {
    logger,
    httpLogMiddleware,
  };
};
