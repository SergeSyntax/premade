import { Env } from '@premade/ms-common/build/config';
import dotenv from 'dotenv';

dotenv.config({
  // services/auth/.env
  path: '.env',
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

type EnvVars = CommonEnvVars & MongoEnvVars;

export const {
  // common
  NODE_ENV = Env.Development,
  PORT = '3000',
  JWT_SECRET,
  // mongodb
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_DB_NAME,
  MONGO_PORT = '27017',
  MONGO_HOST,
} = process.env as EnvVars;
