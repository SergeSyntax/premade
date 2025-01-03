import { RequestHandler } from "express";
import * as core from "express-serve-static-core";
import { StatusCodes } from "http-status-codes";
import { ParsedQs } from "qs";

import { getThumbnailUploadUrl, getVideoUploadUrl } from "../services/uploads";
import { UploadRequestQuery, UploadResponse } from "../types/uploads";

type UploadRequestHandler = RequestHandler<
  core.ParamsDictionary,
  UploadResponse,
  null,
  ParsedQs & UploadRequestQuery
>;

export const getVideoUploadResourceController: UploadRequestHandler = async (req, res) => {
  const uploadDetails = await getVideoUploadUrl(req.query, req.currentUser?.id);

  res.status(StatusCodes.OK).send(uploadDetails);
};

export const getThumbnailUploadResourceController: UploadRequestHandler = async (req, res) => {
  const uploadDetails = await getThumbnailUploadUrl(req.query, req.currentUser?.id);

  res.status(StatusCodes.OK).send(uploadDetails);
};
