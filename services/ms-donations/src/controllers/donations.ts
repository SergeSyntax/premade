import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

import {
  cancelDonationService,
  createDonationService,
  getDonationListService,
  getDonationService,
} from "../services/donations";

export const createDonationController: RequestHandler = async (req, res) => {
  const donation = await createDonationService(req.body, req.currentUser!.id);
  res.status(StatusCodes.CREATED).send({ donation });
};

export const getDonationListController: RequestHandler = async (req, res) => {
  const donations = await getDonationListService(req.currentUser!.id);

  res.status(StatusCodes.OK).send({ donations });
};

export const getDonationController: RequestHandler = async (req, res) => {
  const donation = await getDonationService(
    req.params.donationId as string,
    req.currentUser!.id,
  );

  res.status(StatusCodes.OK).send({ donation });
};

export const cancelDonationController: RequestHandler = async (req, res) => {
  await cancelDonationService(req.params.donationId, req.currentUser!.id);
  res.status(StatusCodes.NO_CONTENT).send();
};
