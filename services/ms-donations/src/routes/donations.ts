import { ReqAttr, requireAuth, validateRequest } from "@devops-premade/ms-common";
import { Router } from "express";

import {
  cancelDonationController,
  createDonationController,
  getDonationController,
  getDonationListController,
} from "../controllers";
import { donationBodySchema, donationResourceParamsSchema } from "../schemas";

const router = Router();

router.post(
  "/",
  requireAuth,
  validateRequest(ReqAttr.BODY, donationBodySchema),
  createDonationController,
);

router.get("/", requireAuth, getDonationListController);

router.get(
  "/:donationId",
  requireAuth,
  validateRequest(ReqAttr.PARAMS, donationResourceParamsSchema),
  getDonationController,
);

router.patch(
  "/:donationId",
  validateRequest(ReqAttr.PARAMS, donationResourceParamsSchema),
  cancelDonationController,
);

export { router as donationsRoutes };
