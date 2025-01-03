import { describe, expect, it, jest } from "@jest/globals";
import { Currency, DonationCancelledEvent, DonationStatus } from "@media-premade/ms-common";
import mongoose from "mongoose";

import { DonationCancelledListener } from "../../src/events/listeners";
import { messageBusClient } from "../../src/message-bus-client";
import { Donation } from "../../src/models";

describe("DonationCancelledListener", () => {
  const setup = async () => {
    const listener = new DonationCancelledListener(messageBusClient.channelWrapper);

    const userId = new mongoose.Types.ObjectId().toHexString();

    const donationId = new mongoose.Types.ObjectId().toHexString();

    const donation = new Donation({
      _id: donationId,
      status: DonationStatus.CREATED,
      currency: Currency.USD,
      userId,
      price: 10,
      version: 0,
    });

    await donation.save();

    const data: DonationCancelledEvent["data"] = {
      id: donation.id,
      version: 1,
      userId,
      media: {
        id: new mongoose.Types.ObjectId().toHexString(),
      },
    };

    const msg = {
      content: Buffer.from(JSON.stringify(data)),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fields: {} as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      properties: {} as any,
    };

    return { listener, data, msg, donation };
  };

  it("calls the onMessage handler with the correct data", async () => {
    const { listener, data, msg, donation } = await setup();

    const onMessageMock = jest.spyOn(listener, "onMessage");

    await listener.handleMessage(msg);

    expect(onMessageMock).toHaveBeenCalledTimes(1);
    expect(onMessageMock).toHaveBeenCalledWith(data, msg);

    const updatedDonation = await Donation.findById(data.id);
    expect(updatedDonation).toBeDefined();
    expect(updatedDonation!.id).toBe(donation._id.toHexString());
    expect(updatedDonation!.status).toBe(DonationStatus.CANCELLED);
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
