import { Channel, ChannelWrapper } from "amqp-connection-manager";
import { PublishOptions } from "amqp-connection-manager/dist/types/ChannelWrapper";
import { Options } from "amqplib";

import { logger } from "#src/logger";
import { EventStructure } from "#src/types/events";

export abstract class Publisher<T extends EventStructure> {
  abstract subject: T["subject"];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static instance?: Publisher<any>;
  private exchangeType = "topic";
  private exchangeOptions: Options.AssertExchange = { durable: true };
  // while you can publish messages with priorities the effect on loaded queues
  // performance might be really significant
  private publishOptions: Options.Publish = { persistent: true, mandatory: true };
  private routingKey = "#"; // Ensure the routing key pattern matches the listener's expectations

  protected get exchangeName() {
    return `ex.${this.subject}`;
  }

  async setupExchange(channel: Channel) {
    try {
      await channel.assertExchange(this.exchangeName, this.exchangeType, this.exchangeOptions);
      logger.debug(
        `Exchange '${this.exchangeName}' of type '${this.exchangeType}' has been asserted successfully.`,
      );
    } catch (error) {
      logger.error(`Failed to assert exchange '${this.exchangeName}':`, error);
      throw error;
    }
  }

  /**
   * Creates an instance of Publisher.
   * @param client - The channel wrapper for managing AMQP connections.
   */
  constructor(protected client: ChannelWrapper) {
    if (Publisher.instance) {
      return Publisher.instance as Publisher<T>;
    } else {
      this.client
        .addSetup(async (channel: Channel) => {
          await this.setupExchange(channel);
        })
        .catch((err) => {
          logger.error(`Error during AMQP setup for subject '${this.exchangeName}':`, err);

          throw err;
        });
      Publisher.instance = this;
    }
  }

  async publish(data: T["data"], options: PublishOptions = {}) {
    try {
      const wasSent = await this.client.publish(this.exchangeName, this.routingKey, data, {
        ...this.publishOptions,
        ...options,
      });
      if (!wasSent) new Error("Message was not confirmed");
      logger.debug(`Message published to exchange '${this.exchangeName}':`, data);
    } catch (error) {
      logger.error(`Failed to publish message to exchange '${this.exchangeName}':`, error);
      throw error;
    }
  }
}
