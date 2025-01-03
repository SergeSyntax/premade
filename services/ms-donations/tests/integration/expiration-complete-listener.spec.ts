import { faker } from "@faker-js/faker";
import { describe, expect, it, jest } from "@jest/globals";
import {
  Currency,
  DonationStatus,
  ExpirationCompleteEvent,
  PaymentModels,
  Visibility,
} from "@media-premade/ms-common";
import mongoose from "mongoose";

import { ExpirationCompleteListener } from "../../src/events";
import { messageBusClient } from "../../src/message-bus-client";
import { Donation, Media } from "../../src/models";

describe("ExpirationCompleteListener", () => {
  const setup = async () => {
    const listener = new ExpirationCompleteListener(messageBusClient.channelWrapper);

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
    });
    await media.save();

    const donation = new Donation({
      userId,
      media,
      status: DonationStatus.CREATED,
      expiresAt: new Date(),
    });

    await donation.save();

    const data: ExpirationCompleteEvent["data"] = {
      donationId: donation.id,
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

  it("updated donation status to cancelled", async () => {
    const { listener, data, msg } = await setup();

    await listener.handleMessage(msg);

    const updatedDonation = await Donation.findById(data.donationId);
    expect(updatedDonation?.status).toBe(DonationStatus.CANCELLED);
  });

  it("emit an donation.cancelled event", async () => {
    const { listener, msg } = await setup();

    await listener.handleMessage(msg);

    const eventData = (messageBusClient.channelWrapper.publish as jest.Mock).mock.calls[0][0]

    expect(messageBusClient.channelWrapper.publish).toHaveBeenCalled()
    expect(eventData).toBe('ex.donation.cancelled')

  });
  it("ack the message", async () => {
    const { listener, msg } = await setup();

    await listener.handleMessage(msg);

    expect(messageBusClient.channelWrapper.ack).toHaveBeenCalledWith(msg);
    expect(messageBusClient.channelWrapper.ack).toHaveBeenCalledTimes(1);
    expect(messageBusClient.channelWrapper.publish).toHaveBeenCalled()

  });

  it("nacks the message on error", async () => {
    const { listener, msg } = await setup();

    jest.spyOn(listener, "onMessage").mockRejectedValueOnce(new Error("Test error"));

    await listener.handleMessage(msg);

    expect(messageBusClient.channelWrapper.nack).toHaveBeenCalledWith(msg, false, true);
  });
});
