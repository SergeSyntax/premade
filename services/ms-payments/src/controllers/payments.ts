import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

import { createPaymentService } from "../services";

export const createPaymentController: RequestHandler = async (req, res) => {
  await createPaymentService(req.body, req.currentUser!.id);

  res.sendStatus(StatusCodes.CREATED);
};
