import { PaymentCreatedEvent } from "@devops-premade/ms-common";
import { describe, expect, it, jest } from "@jest/globals";
import mongoose from "mongoose";

import { PaymentCreatedListener } from "../../src/events";
import { messageBusClient } from "../../src/message-bus-client";
import { Donation } from "../../src/models";

describe("PaymentCreatedListener", () => {
  const setup = async () => {
    const listener = new PaymentCreatedListener(messageBusClient.channelWrapper);

    const data: PaymentCreatedEvent["data"] = {
      id: new mongoose.Types.ObjectId().toHexString(),
      donationId: new mongoose.Types.ObjectId().toHexString(),
      stripeId: new mongoose.Types.ObjectId().toHexString(),
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

    const donation = await Donation.findById(data.id);

    expect(donation).toBeDefined();
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
