import { createLogger, Env } from "@premade/ms-common";
import "@premade/ms-common/eslint.config.mjs";
import { NODE_ENV, LOG_IN_JSON_FORMAT, LOG_LEVEL, CREATE_LOG_FILE } from "../config";

export const { httpLogMiddleware, logger } = createLogger({
  createLogFile: Boolean(CREATE_LOG_FILE),
  disableMorgan: NODE_ENV === Env.Test,
  isJSONFormat: Boolean(LOG_IN_JSON_FORMAT),
  level: LOG_LEVEL,
});
