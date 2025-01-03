import { CommonEnvVars, MongoEnvVars, ServiceEnvVars } from "@media-premade/ms-common/lib/types";

export interface RMQEnvVars {
  RMQ_USERNAME: string;
  RMQ_PASSWORD: string;
  RMQ_HOST: string;
  RMQ_PORT: string;
  RMQ_VHOST: string;
}

type EnvVars = CommonEnvVars & ServiceEnvVars & MongoEnvVars & RMQEnvVars;

export * from "@media-premade/ms-common/lib/config/env";

export const {
  PORT = "5004",
  SERVICE_NAME = "ms-payments",
  // MongoDB
  MONGO_USERNAME = "payments-user",
  MONGO_PASSWORD = "admin",
  MONGO_DB_NAME = "payments",
  MONGO_PORT = "27017, 27018, 27019",
  MONGO_HOST = "localhost, localhost, localhost",
  MONGO_REPLICA_SET = "replicaset",
  // RabbitMQ
  RMQ_USERNAME = "admin",
  RMQ_PASSWORD = "admin",
  RMQ_HOST = "localhost,localhost,localhost",
  RMQ_PORT = "5672,5673,5674",
  RMQ_VHOST = "/",
  RMQ_PROTOCOL = "amqp",
  POD_NAME = "payments-deployment-6b97d4b9c-q5dmn",
  // payment details
  STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET,
} = process.env as EnvVars;
