import { Currency, MediaUpdatedEvent, PaymentModels, Visibility } from "@devops-premade/ms-common";
import { faker } from "@faker-js/faker";
import { describe, expect, it, jest } from "@jest/globals";
import mongoose from "mongoose";

import { MediaUpdatedListener } from "../../src/events";
import { messageBusClient } from "../../src/message-bus-client";
import { Media } from "../../src/models";

describe("MediaUpdatedListener", () => {
  const setup = async (mesgPayload: Partial<MediaUpdatedEvent["data"]> = {}) => {
    const listener = new MediaUpdatedListener(messageBusClient.channelWrapper);
    const id = new mongoose.Types.ObjectId().toHexString();
    const userId = new mongoose.Types.ObjectId().toHexString();
    const media = new Media({
      _id: id,
      title: faker.company.name(),
      price: faker.number.int({ max: 200, min: 100 }),
      currency: Currency.USD,
      visibility: Visibility.PUBLIC,
      paymentModel: PaymentModels.PURCHASE,
      userId,
      ...mesgPayload,
    });
    await media.save();

    const data: MediaUpdatedEvent["data"] = {
      id,
      title: faker.company.name(),
      price: faker.number.int({ max: 300, min: 200 }),
      currency: Currency.EUR,
      visibility: Visibility.PUBLIC,
      paymentModel: PaymentModels.PURCHASE,
      version: 1,
      scheduledDate: new Date().toISOString(),
      donationInProgress: false,
      userId,
      ...mesgPayload,
    };

    const msg = {
      content: Buffer.from(JSON.stringify(data)),
      fields: {} as any,
      properties: {} as any,
    };

    return { listener, data, msg, originalMedia: media };
  };

  it("calls the onMessage handler with the correct data", async () => {
    const { listener, data, msg, originalMedia } = await setup();

    const onMessageMock = jest.spyOn(listener, "onMessage");

    await listener.handleMessage(msg);

    expect(onMessageMock).toHaveBeenCalledTimes(1);
    expect(onMessageMock).toHaveBeenCalledWith(data, msg);

    const updatedMedia = await Media.findById(data.id);

    expect(updatedMedia).toBeDefined();
    expect(updatedMedia?.title).toBe(data.title);
    expect(updatedMedia?.price).toBe(data.price);
    expect(updatedMedia?.currency).toBe(data.currency);

    expect(updatedMedia?.title).not.toBe(originalMedia.title);
    expect(updatedMedia?.price).not.toBe(originalMedia.price);
    expect(updatedMedia?.currency).not.toBe(originalMedia.currency);
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

  it("nacks the message on invalid/skipped version number", async () => {
    const { listener, msg } = await setup({ version: 12 });

    await listener.handleMessage(msg);

    expect(messageBusClient.channelWrapper.nack).toHaveBeenCalledWith(msg, false, true);
  });
});
