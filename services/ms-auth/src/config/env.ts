import { CommonEnvVars, MongoEnvVars, ServiceEnvVars } from "@devops-premade/ms-common/src/types";

type EnvVars = CommonEnvVars & ServiceEnvVars & MongoEnvVars;

export * from "@devops-premade/ms-common/src/config/env";

export const {
  PORT = "5000",
  // mongodb
  MONGO_USERNAME = "auth-user",
  MONGO_PASSWORD = "admin",
  MONGO_DB_NAME = "auth",
  MONGO_PORT = "27017, 27018, 27019",
  MONGO_HOST = "localhost, localhost, localhost",
  MONGO_REPLICA_SET = "replicaset",
} = process.env as EnvVars;
