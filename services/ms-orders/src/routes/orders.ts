import { ReqAttr, requireAuth, validateRequest } from "@devops-premade/ms-common";
import { Router } from "express";

import {
  createOrderController,
  deleteOrderController,
  getOrderResourceController,
  getOrderResourceListController,
} from "../controllers";
import { orderBodySchema, orderResourceParamsSchema } from "../schemas";

const router = Router();

router.get(
  "/:orderId",
  validateRequest(ReqAttr.PARAMS, orderResourceParamsSchema),
  getOrderResourceController,
);

router.delete(
  "/:orderId",
  validateRequest(ReqAttr.PARAMS, orderResourceParamsSchema),
  deleteOrderController,
);

router.get("/", getOrderResourceListController);

router.post(
  "/",
  requireAuth,
  validateRequest(ReqAttr.BODY, orderBodySchema),
  createOrderController,
);

export { router as ordersRoutes };
