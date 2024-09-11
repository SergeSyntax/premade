import { CommonEnvVars, MongoEnvVars, ServiceEnvVars } from "@devops-premade/ms-common/src/types";

export interface RMQEnvVars {
  RMQ_USERNAME: string;
  RMQ_PASSWORD: string;
  RMQ_HOST: string;
  RMQ_PORT: string;
  RMQ_VHOST: string;
}

type EnvVars = CommonEnvVars & ServiceEnvVars & MongoEnvVars & RMQEnvVars;

export * from "@devops-premade/ms-common/src/config/env";

export const {
  PORT = "5002",
  // MongoDB
  MONGO_USERNAME = "admin",
  MONGO_PASSWORD = "admin",
  MONGO_DB_NAME = "orders",
  MONGO_PORT = "27017",
  MONGO_HOST = "localhost",
  // RabbitMQ
  RMQ_USERNAME = "admin",
  RMQ_PASSWORD = "admin",
  RMQ_HOST = "localhost",
  RMQ_PORT = "5672",
  RMQ_VHOST = "/",
  RMQ_PROTOCOL = "amqp",
  POD_NAME = "orders-deployment-6b97d4b9c-q5dmn",
} = process.env as EnvVars;
