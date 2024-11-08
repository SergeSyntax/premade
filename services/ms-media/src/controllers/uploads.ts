import { NotFoundError } from "@devops-premade/ms-common";
import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

import { getUploadUrl } from "../services/uploads";

// export const createMediaController: RequestHandler = async (req, res) => {
//   const media = await createMediaService(req.body, req.currentUser!.id);
//   res.status(StatusCodes.CREATED).send({ media });
// };

// export const updateMediaController: RequestHandler = async (req, res) => {
//   const media = await updateMediaService(req.params.mediaId, req.body, req.currentUser!.id);
//   res.status(StatusCodes.OK).send({ media });
// };

export const getUploadResourceController: RequestHandler = async (req, res) => {
  const uploadDetails = await getUploadUrl(
    (req.query?.fileType as string) ?? "",
    req.currentUser?.id,
  );

  res.status(StatusCodes.OK).send(uploadDetails);
};

// export const getMediaResourceListController: RequestHandler = async (req, res) => {
//   const medias = await getMediaResourceListService();

//   res.status(StatusCodes.OK).send({ medias });
// };
