import { logger } from "@devops-premade/ms-common/src/logger";
import mongoose from "mongoose";

import { MONGO_DB_NAME, MONGO_HOST, MONGO_PASSWORD, MONGO_PORT, MONGO_USERNAME } from "./config";

export const initMongoConnection = async () => {
  logger.info({
    auth: {
      username: MONGO_USERNAME,
      password: MONGO_PASSWORD,
    },
    dbName: MONGO_DB_NAME,
  })
  await mongoose
    .connect(`mongodb://${MONGO_HOST}:${MONGO_PORT}`, {
      auth: {
        username: MONGO_USERNAME,
        password: MONGO_PASSWORD,
      },
      dbName: MONGO_DB_NAME,
    })
    .then(() => logger.info('Connected to MongoDB'))
    .catch(logger.error);
};

