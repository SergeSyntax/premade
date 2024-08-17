import { NotAuthorizedError, NotFoundError } from "@devops-premade/ms-common";

import { MediaCreatedPublisher, MediaUpdatedPublisher } from "../events/publishers";
import { messageBusClient } from "../message-bus-client";
import { Media } from "../models";
import { MediaReqBody } from "../types";

export const createMediaService = async (body: MediaReqBody, userId: string) => {
  const media = new Media({ ...body, userId });
  await media.save();

  await new MediaCreatedPublisher(messageBusClient.channelWrapper).publish({ id: media.id });

  return media;
};

export const getMediaResourceService = async (mediaId: string) => {
  const media = await Media.findById(mediaId);

  if (!media) throw new NotFoundError();

  await new MediaUpdatedPublisher(messageBusClient.channelWrapper).publish({ id: media.id });

  return media;
};

export const updateMediaService = async (mediaId: string, body: MediaReqBody, userId: string) => {
  const media = await getMediaResourceService(mediaId);

  if (media.userId !== userId) throw new NotAuthorizedError();

  Object.keys(body).forEach((attribute) => {
    // eslint-disable-next-line security/detect-object-injection
    media[attribute] = body[attribute];
  });

  await media.save();

  return media;
};

export const getMediaResourceListService = async () => {
  const medias = await Media.find();

  return medias;
};
