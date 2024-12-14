import { ConsumeMessage, DonationCancelledEvent, DonationCreatedEvent } from "@devops-premade/ms-common";

import { Media } from "../models";

export const onDonationCreatedService = async (
  data: DonationCreatedEvent["data"],
  _msg: ConsumeMessage,
) => {
  const media = await Media.findById(data.media.id);

  if (!media) throw new Error("no media found");

  media.set({ donationInProgress: true });

  await media.save();

  return media;
};


export const onDonationCancelledService = async (
  data: DonationCancelledEvent["data"],
  _msg: ConsumeMessage,
) => {
  const media = await Media.findById(data.media.id);

  if (!media) throw new Error("no media found");

  media.set({ donationInProgress: false });

  await media.save();

  return media;
};
