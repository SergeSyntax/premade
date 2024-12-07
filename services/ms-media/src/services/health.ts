import { logger } from "@devops-premade/ms-common/src/logger";

import { mongodbClient } from "../mongodb-client";

export const readyService = async () => {
  try {
    return mongodbClient.ping();
  } catch (err) {
    logger.error("mongo connection check failed");
    throw err;
  }
};
