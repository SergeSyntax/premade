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
  PORT = "5003",
  SERVICE_NAME = "ms-expiration",
  // RabbitMQ
  RMQ_USERNAME = "admin",
  RMQ_PASSWORD = "admin",
  RMQ_HOST = "localhost,localhost,localhost",
  RMQ_PORT = "5672,5673,5674",
  RMQ_VHOST = "/",
  RMQ_PROTOCOL = "amqp",
  POD_NAME = "expiration-deployment-6b97d4b9c-q5dmn",
} = process.env as EnvVars;
