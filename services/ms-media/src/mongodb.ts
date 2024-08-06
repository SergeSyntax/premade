import { logger } from "@devops-premade/ms-common/src/logger";
import mongoose from "mongoose";

import { MONGO_DB_NAME, MONGO_HOST, MONGO_PASSWORD, MONGO_PORT, MONGO_USERNAME } from "./config";

export const connectMongoDB = async () => {
  const mongoUri = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME}?authSource=admin`;

  try {
    await mongoose.connect(mongoUri);
    logger.info("MongoDB connection established.");
  } catch (err) {
    logger.error(`MongoDB connection error: ${(err as Error).message}`);
  }
};
