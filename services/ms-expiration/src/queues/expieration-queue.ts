import { Queue, Worker } from "bullmq";

import { ExpirationCompletePublisher } from "../events";
import { messageBusClient } from "../message-bus-client";

const EXPIRATION_QUEUE_NAME = "donation.expiration";

interface Payload {
  donationId: string;
}

// TODO: change from hardcoded
const redisConnection = {
  host: "localhost",
  port: 6379,
  password: undefined,
  db: 0,
};

const expirationQueue = new Queue<Payload>(EXPIRATION_QUEUE_NAME, {
  connection: redisConnection,
});

const expirationWorker = new Worker<Payload>(
  EXPIRATION_QUEUE_NAME,
  (job) =>
    new ExpirationCompletePublisher(messageBusClient.channelWrapper).publish({
      donationId: job.data.donationId,
    }),
  {
    connection: redisConnection,
  },
);

// change to logger think about reuse for the video streaming process
// Handle worker events (optional)
expirationWorker.on("completed", (job) => {
  console.log(`Job with ID ${job.id} has been completed.`);
});

expirationWorker.on("failed", (job, err) => {
  console.error(`Job with ID ${job?.id} failed with error:`, err);
});

export { expirationQueue };
