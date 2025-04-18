import { logger } from "@media-premade/ms-common/lib/logger";

import { app } from "./app";
import { PORT } from "./config";
import { ExpirationCompleteListener, MediaCreatedListener, MediaUpdatedListener } from "./events";
import { PaymentCreatedListener } from "./events/listeners/payment-created-listener";
import { messageBusClient } from "./message-bus-client";
import { mongodbClient } from "./mongodb-client";

const handleTerm = async () => {
  await mongodbClient.disconnect();
  await messageBusClient.disconnect();
  process.exit();
};

process.on("SIGTERM", handleTerm);
process.on("SIGINT", handleTerm);

await mongodbClient.connect();
await messageBusClient.connect();

await new MediaCreatedListener(messageBusClient.channelWrapper).listen();
await new MediaUpdatedListener(messageBusClient.channelWrapper).listen();
await new ExpirationCompleteListener(messageBusClient.channelWrapper).listen();
await new PaymentCreatedListener(messageBusClient.channelWrapper).listen();

app.listen(PORT, () => logger.info(`Listening on port ${PORT}`));
