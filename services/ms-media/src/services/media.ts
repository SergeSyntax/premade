import { NotAuthorizedError, NotFoundError } from "@devops-premade/ms-common";

import { Media } from "../models";
import { MediaReqBody } from "../types";

export const createMediaService = async (body: MediaReqBody, userId: string) => {
  const newMedia = new Media({ ...body, userId });
  await newMedia.save();

  return newMedia;
};

export const getMediaResourceService = async (mediaId: string) => {
  const media = await Media.findById(mediaId);

  if (!media) throw new NotFoundError();

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
