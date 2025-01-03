import { ReqAttr, requireAuth, validateRequest } from "@media-premade/ms-common";
import { Router } from "express";

import { createPaymentController } from "../controllers";
import { paymentBodySchema } from "../schemas";

const router = Router();

router.post(
  "/",
  requireAuth,
  validateRequest(ReqAttr.BODY, paymentBodySchema),
  createPaymentController,
);

export { router as paymentsRoutes };
