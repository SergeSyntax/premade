import { logger } from "@devops-premade/ms-common/src/logger";

import { app } from "./app";
import { PORT, STRIPE_SECRET_KEY } from "./config";
import { DonationCancelledListener, DonationCreatedListener } from "./events/listeners";
import { messageBusClient } from "./message-bus-client";
import { mongodbClient } from "./mongodb-client";

if (!STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY must be defined");

const handleTerm = async () => {
  await mongodbClient.disconnect();
  await messageBusClient.disconnect();
  process.exit();
};

process.on("SIGTERM", handleTerm);
process.on("SIGINT", handleTerm);

await mongodbClient.connect();
await messageBusClient.connect();

await new DonationCreatedListener(messageBusClient.channelWrapper).listen();
await new DonationCancelledListener(messageBusClient.channelWrapper).listen();

app.listen(PORT, () => logger.info(`Listening on port ${PORT}`));
