import amqp, { AmqpConnectionManager, ChannelWrapper } from "amqp-connection-manager";
import { Channel,Message, Options } from "amqplib";

import { logger } from "../logger";
import { parseConnectionConfig } from "../utils";

interface MessageBusClientOptions {
  hostsEnv: string;
  portsEnv: string;
  connectOptions: Options.Connect;
  connectionName: string;
  prefetch?: number;
  publishTimeout?: number;
}

export class MessageBusClient {
  private _connection?: AmqpConnectionManager;
  private _channelWrapper?: ChannelWrapper;

  public get connection(): AmqpConnectionManager {
    if (!this._connection)
      throw new Error(
        "RabbitMQ connection is not established. Ensure connect() is called before accessing the connection.",
      );
    return this._connection;
  }

  public get channelWrapper(): ChannelWrapper {
    if (!this._channelWrapper) {
      throw new Error(
        "RabbitMQ channelWrapper is not established. Ensure connect() is called before accessing the channel.",
      );
    }
    return this._channelWrapper;
  }

  constructor(private options: MessageBusClientOptions) {}

  handleUndeliverableMessage = async (msg: Message) => {
    const exchangeName = msg.fields.exchange;
    const routingKey = msg.fields.routingKey;
    const messageContent = msg.content ? msg.content.toString() : "No content";
    const errorMessage = `Message undeliverable: Returned from exchange '${exchangeName}' with routing key '${routingKey}'. Content: ${messageContent}`;
    logger.error(errorMessage);

    await this.disconnect();
  };

  public async connect() {
    const {
      hostsEnv,
      portsEnv,
      connectOptions,
      connectionName,
      prefetch = 1,
      publishTimeout = 10000,
    } = this.options;

    const { hosts, ports } = parseConnectionConfig(hostsEnv, portsEnv, "RabbitMQ");

    const urls = hosts.map((hostname, i) => ({
      hostname,
      port: +ports[i],
      ...connectOptions,
    }));

    // Create a connection manager
    this._connection = amqp.connect(urls, {
      connectionOptions: {
        clientProperties: {
          connection_name: connectionName,
        },
      },
    });

    this.connection.on("connect", () => {
      logger.info(`[${connectionName}] RabbitMQ connection established successfully.`);
    });

    this.connection.on("connectFailed", ({ err, url }) => {
      const { password, username, ...urlParams } = url as Options.Connect;
      logger.error(
        `[${connectionName}] RabbitMQ connection attempt to ${JSON.stringify(
          urlParams,
        )} failed with error: ${err.message}`,
      );
    });

    this.connection.on("blocked", ({ reason }) => {
      logger.error(`[${connectionName}] RabbitMQ connection is blocked due to: ${reason}.`);
    });

    this.connection.on("unblocked", () => {
      logger.info(`[${connectionName}] RabbitMQ connection is now unblocked.`);
    });

    this.connection.on("disconnect", ({ err }) => {
      logger.error(
        `[${connectionName}] RabbitMQ connection was lost. Reason: ${
          err ? err.stack : "Unknown error"
        }.`,
      );
    });

    this._channelWrapper = this._connection.createChannel({
      json: true,
      confirm: true,
      publishTimeout,
      name: connectionName,
      setup: async (channel: Channel) => {
        await channel.prefetch(prefetch);
        channel.on("return", this.handleUndeliverableMessage);
      },
    });

    await this.channelWrapper.waitForConnect();
    logger.info(`[${connectionName}] RabbitMQ channel established successfully.`);
  }

  public disconnect = async () => {
    await this.channelWrapper.close();
    await this.connection.close();
    logger.info(
      `RabbitMQ connection [${this.options.connectionName}] closed gracefully due to application termination.`,
    );
  };

  public async ack(message: Message, allUpTo?: boolean) {
    return this.channelWrapper.ack(message, allUpTo);
  }

  public async nack(message: Message, allUpTo?: boolean, requeue?: boolean) {
    return this.channelWrapper.nack(message, allUpTo, requeue);
  }
}
