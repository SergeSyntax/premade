import { logger } from "@media-premade/ms-common";
import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

import { readyService } from "../services";

export const readyController: RequestHandler = async (_req, res) => {
  try {
    await readyService();

    res.sendStatus(StatusCodes.OK);
  } catch (err) {
    logger.warn("failed health check", { err });
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const liveController: RequestHandler = (_req, res) => {
  return res.sendStatus(StatusCodes.OK);
};
