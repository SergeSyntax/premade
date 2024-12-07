import { ConsumeMessage, MediaCreatedEvent, MediaUpdatedEvent } from "@devops-premade/ms-common";

import { Media } from "../models";

export async function onMediaCreatedService(data: MediaCreatedEvent["data"], _msg: ConsumeMessage) {
  const { id, currency, paymentModel, price, title, visibility, scheduledDate } = data;
  const media = new Media({
    _id: id,
    currency,
    paymentModel,
    price,
    title,
    visibility,
    scheduledDate,
  });

  await media.save();
}

export async function onMediaUpdatedService(data: MediaUpdatedEvent["data"], _msg: ConsumeMessage) {
  const media = await Media.findById(data.id);

  if (!media) throw new Error("Media not found");

  const { currency, paymentModel, price, title, visibility, scheduledDate } = data;

  media.set({
    currency,
    paymentModel,
    price,
    title,
    visibility,
    scheduledDate,
  });

  await media.save();
}
