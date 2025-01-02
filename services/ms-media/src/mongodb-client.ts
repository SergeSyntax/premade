import { MongoDBClient } from "@media-premade/ms-common";

import {
  MONGO_DB_NAME,
  MONGO_HOST,
  MONGO_PASSWORD,
  MONGO_PORT,
  MONGO_REPLICA_SET,
  MONGO_USERNAME,
} from "./config";

export const mongodbClient = new MongoDBClient(
  MONGO_HOST,
  MONGO_PORT,
  MONGO_REPLICA_SET,
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_DB_NAME,
);
