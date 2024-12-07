import mongoose from "mongoose";

import { logger } from "../logger";
import { parseConnectionConfig } from "../utils";

export class MongoDBClient {
  constructor(
    private hostEnv: string,
    private portEnv: string,
    private replicaSet: string,
    private username: string,
    private password: string,
    private database: string,
  ) {}

  async connect() {
    const { hosts, ports } = parseConnectionConfig(this.hostEnv, this.portEnv, "MongoDB");

    const connectionString = hosts
      .reduce<string[]>(
        // eslint-disable-next-line security/detect-object-injection
        (connection, host, i) => [...connection, `${host}:${ports[i]}`],
        [],
      )
      .join(",");

    const mongoUri = `mongodb://${this.username}:${this.password}@${connectionString}/${this.database}`;

    try {
      await mongoose.connect(mongoUri, { replicaSet: this.replicaSet });
      logger.info("MongoDB connection established.");
    } catch (err) {
      logger.error(`MongoDB connection error: ${(err as Error).message}`);
    }
  }

  async disconnect() {
    try {
      await mongoose.disconnect();
      logger.info("Mongoose: Connection closed gracefully due to application termination.");
    } catch (error) {
      logger.error("Mongoose: Error during disconnection.", error);
    }
  }

  ping() {
    return mongoose.connection.db?.admin().ping();
  }
}
