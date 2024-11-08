import { CommonEnvVars, MongoEnvVars, ServiceEnvVars } from "@devops-premade/ms-common/src/types";

interface K8SEnvVars {
  POD_NAME: string;
}

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
  PORT = "5001",
  // MongoDB
  MONGO_USERNAME = "admin",
  MONGO_PASSWORD = "admin",
  MONGO_DB_NAME = "media",
  MONGO_PORT = "27017",
  MONGO_HOST = "localhost",
  // RabbitMQ
  RMQ_USERNAME = "admin",
  RMQ_PASSWORD = "admin",
  RMQ_HOST = "localhost",
  RMQ_PORT = "5672",
  RMQ_VHOST = "/",
  RMQ_PROTOCOL = "amqp",
  POD_NAME = "media-deployment-6b97d4b9c-q5dmn",
  // MinIO
  MIO_ENDPOINT = "http://localhost:9000",
  MIO_ACCESS_KEY = "bucket_key",
  MIO_SECRET_KEY = "bucket_key",
  MIO_BUCKET = "media-bucket",
} = process.env as EnvVars;
