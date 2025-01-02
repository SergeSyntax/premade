import { BadRequestError, NotAuthorizedError, NotFoundError } from "@devops-premade/ms-common";

import { MIO_MEDIA_BUCKET, MIO_THUMBNAIL_BUCKET } from "../config";
import { IMAGE_EXPIRE_IN, VIDEO_EXPIRE_IN } from "../config/const";
import { MediaCreatedPublisher, MediaUpdatedPublisher } from "../events/publishers";
import { messageBusClient } from "../message-bus-client";
import { Media } from "../models";
import { storageClient } from "../storage-client";
import { MediaReqBody } from "../types";

export const createMediaService = async (body: MediaReqBody, userId: string) => {
  const media = new Media({ ...body, userId });
  await media.save();

  await new MediaCreatedPublisher(messageBusClient.channelWrapper).publish({
    id: media.id,
    title: media.title,
    price: media.price,
    currency: media.currency!,
    paymentModel: media.paymentModel!,
    visibility: media.visibility!,
    scheduledDate: media.scheduledDate?.toISOString(),
    version: media.version,
    userId,
  });

  return media;
};

export const getMediaResourceService = async (mediaId: string) => {
  const media = await Media.findById(mediaId);

  if (!media) throw new NotFoundError();

  const url = await storageClient.signGetObjectCommand(
    MIO_MEDIA_BUCKET,
    media.videoUrl,
    VIDEO_EXPIRE_IN,
  );

  media.videoUrl = url;

  return media;
};

export const updateMediaService = async (mediaId: string, body: MediaReqBody, userId: string) => {
  const media = await getMediaResourceService(mediaId);

  if (media.donationInProgress)
    throw new BadRequestError("Cannot edit a media in donation progress");

  if (media.userId !== userId) throw new NotAuthorizedError();

  Object.keys(body).forEach((attribute) => {
    // eslint-disable-next-line security/detect-object-injection
    media[attribute] = body[attribute];
  });

  await new MediaUpdatedPublisher(messageBusClient.channelWrapper).publish({
    id: media.id,
    title: media.title,
    price: media.price,
    currency: media.currency!,
    paymentModel: media.paymentModel!,
    visibility: media.visibility!,
    scheduledDate: media.scheduledDate?.toISOString(),
    donationInProgress: media.donationInProgress,
    version: media.version,
    userId,
  });

  await media.save();

  return media;
};

export const getMediaResourceListService = async () => {
  const medias = await Media.find();

  for (const media of medias) {
    const url = await storageClient.signGetObjectCommand(
      MIO_THUMBNAIL_BUCKET,
      media.thumbnailUrl,
      IMAGE_EXPIRE_IN,
      "max-age=3600, must-revalidate",
    );

    media.thumbnailUrl = url;
  }

  return medias;
};
