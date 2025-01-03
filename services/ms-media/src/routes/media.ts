import { ReqAttr, requireAuth, validateRequest } from "@media-premade/ms-common";
import { Router } from "express";

import {
  createMediaController,
  getMediaResourceController,
  getMediaResourceListController,
  updateMediaController,
} from "../controllers/media";
import { mediaBodySchema, mediaResourceParamsSchema, mediaUpdateBodySchema } from "../schemas";

const router = Router();

/**
 * @openapi
 * /api/media:
 *  post:
 *    summary: create a nedia file
 *    responses:
 *      201:
 *        description: created
 */
router.post(
  "/",
  requireAuth,
  validateRequest(ReqAttr.BODY, mediaBodySchema),
  createMediaController,
);

router.get("/", getMediaResourceListController);

router.get(
  "/:mediaId",
  validateRequest(ReqAttr.PARAMS, mediaResourceParamsSchema),
  getMediaResourceController,
);

router.put(
  "/:mediaId",
  requireAuth,
  validateRequest(ReqAttr.PARAMS, mediaResourceParamsSchema),
  validateRequest(ReqAttr.BODY, mediaUpdateBodySchema),
  updateMediaController,
);

export { router as mediaRoutes };
