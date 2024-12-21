import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

import { createPaymentService } from "../services";

export const createPaymentController: RequestHandler = async (req, res) => {
  const paymentId = await createPaymentService(req.body, req.currentUser!.id);

  res.status(StatusCodes.CREATED).json({ id: paymentId });
};
