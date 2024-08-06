import { logger } from "@devops-premade/ms-common/src/logger";
import mongoose from "mongoose";

import { app } from "./app";
import { PORT } from "./config";
import { messageBusClient } from "./message-bus-client";
import { connectMongoDB } from "./mongodb";

const handleTerm = async () => {
  await messageBusClient.disconnect();
  await mongoose.disconnect();
  process.exit(0);
};

process.on("SIGTERM", handleTerm);
process.on("SIGINT", handleTerm);

await connectMongoDB();
await messageBusClient.connect();

app.listen(PORT, () => logger.info(`Listening on port ${PORT}`));
