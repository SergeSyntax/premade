import { faker } from "@faker-js/faker";
import { describe, expect, it, jest } from "@jest/globals";
import { DonationCancelledEvent } from "@media-premade/ms-common";
import mongoose from "mongoose";

import { DonationCancelledListener } from "../../src/events/listeners";
import { messageBusClient } from "../../src/message-bus-client";
import { Media } from "../../src/models";
import { generateMedia } from "../utils/media";

describe("DonationCancelledListener", () => {
  const setup = async () => {
    const listener = new DonationCancelledListener(messageBusClient.channelWrapper);

    const userId = new mongoose.Types.ObjectId().toHexString();
    const title = faker.company.name();

    const media = new Media({
      ...generateMedia(title),
      userId,
      donationInProgress: true,
    });

    await media.save();

    const data: DonationCancelledEvent["data"] = {
      id: new mongoose.Types.ObjectId().toHexString(),
      version: 0,
      userId,
      media: {
        id: media.id,
      },
    };

    const msg = {
      content: Buffer.from(JSON.stringify(data)),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fields: {} as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      properties: {} as any,
    };

    return { listener, data, msg, media };
  };

  it("calls the onMessage handler with the correct data", async () => {
    const { listener, data, msg, media } = await setup();

    const onMessageMock = jest.spyOn(listener, "onMessage");
    expect(media?.donationInProgress).toBe(true);

    await listener.handleMessage(msg);

    expect(onMessageMock).toHaveBeenCalledTimes(1);
    expect(onMessageMock).toHaveBeenCalledWith(data, msg);

    const updatedMedia = await Media.findById(data.media.id);
    expect(updatedMedia).toBeDefined();
    expect(updatedMedia?.donationInProgress).toBe(false);
    expect(messageBusClient.channelWrapper.publish).toHaveBeenCalled();

    //     expect(media?.price).toBe(data.price);
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
