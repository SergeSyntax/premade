import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

import { readyService } from "../services";

export const readyController: RequestHandler = async (_req, res) => {
  try {
    await readyService();

    res.sendStatus(StatusCodes.OK);
  } catch (error) {
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const liveController: RequestHandler = (_req, res) => {
  return res.sendStatus(StatusCodes.OK);
};
