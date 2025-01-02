import {
  DonationCancelledEvent,
  DonationCreatedEvent,
  DonationStatus,
  logger,
} from "@devops-premade/ms-common";

import { Donation } from "../models";

export const onDonationCreatedService = async (data: DonationCreatedEvent["data"]) => {
  try {
    logger.debug(`Starting donation creation process for ID: ${data.id}`);

    const donation = new Donation({
      _id: data.id,
      price: data.media.price,
      currency: data.media.currency,
      status: data.status,
      userId: data.userId,
      version: data.version,
    });

    logger.debug(`Donation object constructed: ${JSON.stringify(donation.toObject())}`);

    await donation.save();
  } catch (err) {
    logger.error(`Error occurred while creating donation for ID: ${data.id}`, {
      error: (err as Error).message,
      stack: (err as Error).stack,
    });
  }
};

export const onDonationCancelledService = async (data: DonationCancelledEvent["data"]) => {
  const donation = await Donation.findOne({
    _id: data.id,
    version: data.version - 1,
  });

  if (!donation) throw new Error("no donation found");
  if (donation.status === DonationStatus.COMPLETE) return;

  donation.set({ status: DonationStatus.CANCELLED });

  await donation.save();
};
