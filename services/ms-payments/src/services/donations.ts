import {
  DonationCancelledEvent,
  DonationCreatedEvent,
  DonationStatus,
} from "@devops-premade/ms-common";

import { Donation } from "../models";

export const onDonationCreatedService = async (data: DonationCreatedEvent["data"]) => {
  const donation = new Donation({
    _id: data.id,
    price: data.media.price,
    currency: data.media.currency,
    status: data.status,
    userId: data.userId,
    version: data.version,
  });

  await donation.save();
};

export const onDonationCancelledService = async (data: DonationCancelledEvent["data"]) => {
  const donation = await Donation.findOne({
    _id: data.id,
    version: data.version - 1,
  });

  if (!donation) throw new Error("no donation found");

  donation.set({ status: DonationStatus.CANCELLED });

  await donation.save();
};
