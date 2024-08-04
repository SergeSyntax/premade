import { CommonEnvVars, MongoEnvVars, ServiceEnvVars } from "@devops-premade/ms-common/src/types";

type EnvVars = CommonEnvVars & ServiceEnvVars & MongoEnvVars;

export * from "@devops-premade/ms-common/src/config/env";

export const {
  PORT = "5001",
  // mongodb
  MONGO_USERNAME = "admin",
  MONGO_PASSWORD = "admin",
  MONGO_DB_NAME = "media",
  MONGO_PORT = "27017",
  MONGO_HOST = "localhost",
} = process.env as EnvVars;
