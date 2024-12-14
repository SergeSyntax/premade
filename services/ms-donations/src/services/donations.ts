import {
  BadRequestError,
  ConsumeMessage,
  DonationStatus,
  ExpirationCompleteEvent,
  NotAuthorizedError,
  NotFoundError,
} from "@devops-premade/ms-common";

import { EXPIRATION_WINDOW_SECONDS } from "../config";
import { DonationCancelledPublisher, DonationCreatedPublisher } from "../events/publishers";
import { messageBusClient } from "../message-bus-client";
import { Donation, Media } from "../models";
import { DonationReqBody } from "../types";

export const getDonationListService = async (userId: string) => {
  const donations = await Donation.find({
    userId,
  }).populate("media");

  return donations;
};

export const createDonationService = async (body: DonationReqBody, userId: string) => {
  const media = await Media.findById(body.mediaId);
  if (!media) throw new NotFoundError();

  if (!media.canBuy()) throw new BadRequestError("This media item is not available for purchase.");

  const expiresAt = new Date();
  expiresAt.setSeconds(expiresAt.getSeconds() + +EXPIRATION_WINDOW_SECONDS);

  const donation = new Donation({ expiresAt, userId, media, status: DonationStatus.CREATED });
  await donation.save();

  await new DonationCreatedPublisher(messageBusClient.channelWrapper).publish({
    id: donation.id,
    version: donation.version,
    status: donation.status,
    userId: donation.userId,
    expiresAt: donation.expiresAt.toISOString(),
    media: {
      id: media.id,
      price: media.price,
    },
  });

  return donation;
};

export const getDonationService = async (donationId: string, userId: string) => {
  const donation = await Donation.findById(donationId).populate("media");

  if (!donation) throw new NotFoundError();

  if (donation.userId !== userId) throw new NotAuthorizedError();

  return donation;
};

export const cancelDonationService = async (donationId: string, userId: string) => {
  const donation = await getDonationService(donationId, userId);

  donation.status = DonationStatus.CANCELLED;

  await donation.save();

  await new DonationCancelledPublisher(messageBusClient.channelWrapper).publish({
    id: donation.id,
    version: donation.version,
    userId,
    media: {
      id: donation.media.id,
    },
  });
};

export const onExpirationComplete = async (
  data: ExpirationCompleteEvent["data"],
  _msg: ConsumeMessage,
) => {
  const donation = await Donation.findById(data.donationId).populate("media");

  if (!donation) throw new Error("Donation not found");

  donation.set({ status: DonationStatus.CANCELLED });

  await donation.save();

  await new DonationCancelledPublisher(messageBusClient.channelWrapper).publish({
    id: donation.id,
    version: donation.version,
    userId: donation.userId,
    media: {
      id: donation.media.id,
    },
  });
};
