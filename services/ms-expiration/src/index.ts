import { DonationCreatedListener } from "./events/listeners/donation-created-listener";
import { messageBusClient } from "./message-bus-client";

const handleTerm = async () => {
  await messageBusClient.disconnect();
  process.exit();
};

process.on("SIGTERM", handleTerm);
process.on("SIGINT", handleTerm);

await messageBusClient.connect();

await new DonationCreatedListener(messageBusClient.channelWrapper).listen()
