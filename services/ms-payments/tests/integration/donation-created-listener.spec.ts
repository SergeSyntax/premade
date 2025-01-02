import { describe, expect, it, jest } from "@jest/globals";
import {
  Currency,
  DonationCreatedEvent,
  DonationStatus,
} from "@media-premade/ms-common";
import mongoose from "mongoose";

import { DonationCreatedListener } from "../../src/events/listeners";
import { messageBusClient } from "../../src/message-bus-client";
import { Donation } from "../../src/models";

describe("DonationCreatedListener", () => {
  const setup = async () => {
    const listener = new DonationCreatedListener(messageBusClient.channelWrapper);

    const userId = new mongoose.Types.ObjectId().toHexString();

    const data: DonationCreatedEvent["data"] = {
      id: new mongoose.Types.ObjectId().toHexString(),
      version: 0,
      userId,
      status: DonationStatus.CREATED,
      expiresAt: "asdf",
      media: {
        id: new mongoose.Types.ObjectId().toHexString(),
        price: 29,
        currency: Currency.USD,
      },
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

  it("replicates the donation info", async () => {
    const { listener, data, msg } = await setup();

    const onMessageMock = jest.spyOn(listener, "onMessage");

    await listener.handleMessage(msg);

    expect(onMessageMock).toHaveBeenCalledTimes(1);
    expect(onMessageMock).toHaveBeenCalledWith(data, msg);

    const donation = await Donation.findById(data.id);
    expect(donation).toBeDefined();
    expect(donation!._id.toHexString()).toBe(data.id);
    expect(donation!.status).toBe(data.status);
    expect(donation!.price).toBe(data.media.price);
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
