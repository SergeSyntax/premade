import { NotFoundError } from "@media-premade/ms-common";
import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

import {
  createMediaService,
  getMediaResourceListService,
  getMediaResourceService,
  updateMediaService,
} from "../services/media";

export const createMediaController: RequestHandler = async (req, res) => {
  const media = await createMediaService(req.body, req.currentUser!.id);
  res.status(StatusCodes.CREATED).send({ media });
};

export const updateMediaController: RequestHandler = async (req, res) => {
  const media = await updateMediaService(req.params.mediaId, req.body, req.currentUser!.id);
  res.status(StatusCodes.OK).send({ media });
};

export const getMediaResourceController: RequestHandler = async (req, res) => {
  const media = await getMediaResourceService(req.params.mediaId as string);

  if (!media) {
    throw new NotFoundError();
  }

  res.status(StatusCodes.OK).send({ media });
};

export const getMediaResourceListController: RequestHandler = async (req, res) => {
  const medias = await getMediaResourceListService();

  res.status(StatusCodes.OK).send({ medias });
};
