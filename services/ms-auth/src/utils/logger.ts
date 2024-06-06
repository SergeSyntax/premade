import "@premade/ms-common/eslint.config.mjs";

import { createLogger, Env } from "@premade/ms-common";

import { LOG_IN_JSON_FORMAT, LOG_LEVEL, NODE_ENV } from "../config";

export const { httpLogMiddleware, logger } = createLogger({
  createLogFile: NODE_ENV === Env.Development,
  disableMorgan: NODE_ENV === Env.Test,
  isJSONFormat: Boolean(LOG_IN_JSON_FORMAT),
  level: LOG_LEVEL,
});
