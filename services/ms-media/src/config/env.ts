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
  MONGO_USERNAME = "media-user",
  MONGO_PASSWORD = "admin",
  MONGO_DB_NAME = "media",
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
  POD_NAME = "media-deployment-6b97d4b9c-q5dmn",
  // MinIO
  MIO_ENDPOINT = "http://localhost:9000",
  MIO_ACCESS_KEY = "fi6agQe0bYLFLT2BPSZ4",
  MIO_SECRET_KEY = "qKaR1V0sbmhRSPdWG6BBEBtAcW0YswSC7BDO9sMo",
  MIO_MEDIA_BUCKET = "media-bucket",
  MIO_THUMBNAIL_BUCKET = "thumbnail-bucket",
} = process.env as EnvVars;
