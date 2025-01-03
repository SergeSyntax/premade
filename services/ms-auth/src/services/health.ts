import { logger } from "@media-premade/ms-common/lib/logger";

import { mongodbClient } from "../mongodb-client";

export const readyService = async () => {
  try {
    return mongodbClient.ping();
  } catch (err) {
    logger.error("mongo connection check failed");
    throw err;
  }
};
