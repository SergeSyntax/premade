import { faker } from "@faker-js/faker";
import { describe, expect, it, jest } from "@jest/globals";
import { Currency, MediaCreatedEvent, PaymentModels, Visibility } from "@media-premade/ms-common";
import mongoose from "mongoose";

import { MediaCreatedListener } from "../../src/events";
import { messageBusClient } from "../../src/message-bus-client";
import { Media } from "../../src/models";

describe("MediaCreatedListener", () => {
  const setup = async () => {
    const listener = new MediaCreatedListener(messageBusClient.channelWrapper);

    const data: MediaCreatedEvent["data"] = {
      id: new mongoose.Types.ObjectId().toHexString(),
      title: faker.company.name(),
      price: faker.number.int({ max: 200, min: 100 }),
      currency: Currency.USD,
      visibility: Visibility.PUBLIC,
      paymentModel: PaymentModels.PURCHASE,
      userId: new mongoose.Types.ObjectId().toHexString(),
      version: 0,
    };

    const msg = {
      content: Buffer.from(JSON.stringify(data)),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fields: {} as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      properties: {} as any,
    };

    return { listener, data, msg };
  };

  it("calls the onMessage handler with the correct data", async () => {
    const { listener, data, msg } = await setup();

    const onMessageMock = jest.spyOn(listener, "onMessage");

    await listener.handleMessage(msg);

    expect(onMessageMock).toHaveBeenCalledTimes(1);
    expect(onMessageMock).toHaveBeenCalledWith(data, msg);

    const media = await Media.findById(data.id);

    expect(media).toBeDefined();
    expect(media?.title).toBe(data.title);
    expect(media?.price).toBe(data.price);
  });

  it("acks the message on successful processing", async () => {
    const { listener, msg } = await setup();

    await listener.handleMessage(msg);

    expect(messageBusClient.channelWrapper.ack).toHaveBeenCalledWith(msg);
  });

  it("nacks the message on error", async () => {
    const { listener, msg } = await setup();

    jest.spyOn(listener, "onMessage").mockRejectedValueOnce(new Error("Test error"));

    await listener.handleMessage(msg);

    expect(messageBusClient.channelWrapper.nack).toHaveBeenCalledWith(msg, false, true);
  });
});
