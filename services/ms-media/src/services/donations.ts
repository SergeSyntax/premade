import {
  ConsumeMessage,
  DonationCancelledEvent,
  DonationCreatedEvent,
  logger,
} from "@media-premade/ms-common";

import { Media } from "../models";

export const onDonationCreatedService = async (
  data: DonationCreatedEvent["data"],
  _msg: ConsumeMessage,
) => {
  try {
    const media = await Media.findById(data.media.id);

    if (!media) throw new Error(`Media not found for ID: ${data.media.id}`);
    logger.debug(`Media fetched successfully: ${media.id}`);

    media.set({ donationInProgress: true });

    await media.save();

    return media;
  } catch (err) {
    logger.error(`Error processing donation for media ID: ${data.media.id}`, {
      error: (err as Error).message,
      stack: (err as Error).stack,
    });
    throw new Error((err as Error).message);
  }
};

export const onDonationCancelledService = async (data: DonationCancelledEvent["data"]) => {
  const media = await Media.findById(data.media.id);

  if (!media) throw new Error("no media found");

  media.set({ donationInProgress: false });

  await media.save();

  return media;
};
