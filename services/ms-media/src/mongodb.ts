import { logger } from "@devops-premade/ms-common/src/logger";
import mongoose from "mongoose";

import { MONGO_DB_NAME, MONGO_HOST, MONGO_PASSWORD, MONGO_PORT, MONGO_USERNAME } from "./config";

export const connectMongoDB = async () => {
  const mongoHostList = MONGO_HOST.split(",")
    .map((host) => `${host}:${MONGO_PORT}`)
    .join(",");
  const mongoUri = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${mongoHostList}/${MONGO_DB_NAME}?authSource=admin`;

  try {
    await mongoose.connect(mongoUri);
    logger.info("MongoDB connection established.");
  } catch (err) {
    logger.error(`MongoDB connection error: ${(err as Error).message}`);
  }
};

export const disconnectMongoDB = async () => {
  try {
    await mongoose.disconnect();
    logger.info("Mongoose: Connection closed gracefully due to application termination.");
  } catch (error) {
    logger.error("Mongoose: Error during disconnection.", error);
  }
};
