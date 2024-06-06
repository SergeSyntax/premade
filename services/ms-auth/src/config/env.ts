import { Env, LevelType } from "@premade/ms-common/build/types";
import dotenv from "dotenv";

dotenv.config({
  // services/auth/.env
  path: ".env",
});

interface CommonEnvVars extends NodeJS.ProcessEnv {
  NODE_ENV: Env;
  PORT: string;
  JWT_SECRET: string;
}

interface MongoEnvVars {
  MONGO_USERNAME: string;
  MONGO_PASSWORD: string;
  MONGO_DB_NAME: string;
  MONGO_HOST: string;
  MONGO_PORT: string;
}

interface LogEnvVars {
  CREATE_LOG_FILE?: string;
  LOG_IN_JSON_FORMAT?: string;
  LOG_LEVEL?: LevelType;
}

type EnvVars = CommonEnvVars & MongoEnvVars & LogEnvVars;

export const {
  // common
  NODE_ENV = Env.Development,
  PORT = "3000",
  JWT_SECRET='some_secret',
  // logs
  CREATE_LOG_FILE,
  LOG_IN_JSON_FORMAT,
  LOG_LEVEL = LevelType.DEBUG,
  // mongodb
  MONGO_USERNAME = "admin",
  MONGO_PASSWORD = "admin",
  MONGO_DB_NAME = "auth",
  MONGO_PORT = "27017",
  MONGO_HOST = "localhost",
} = process.env as EnvVars;
