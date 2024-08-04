import { LevelType } from "./enums";

interface LogEnvVars {
  CREATE_LOG_FILE?: string;
  LOG_IN_JSON_FORMAT?: string;
  LOG_LEVEL?: LevelType;
}

interface AuthEnvVars {
  JWT_SECRET: string;
}

export type CommonEnvVars = NodeJS.ProcessEnv & LogEnvVars & AuthEnvVars;

export interface ServiceEnvVars {
  PORT: string;
}

export interface MongoEnvVars {
  MONGO_USERNAME: string;
  MONGO_PASSWORD: string;
  MONGO_DB_NAME: string;
  MONGO_HOST: string;
  MONGO_PORT: string;
}
