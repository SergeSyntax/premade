import { ReqAttr, requireAuth, validateRequest } from "@devops-premade/ms-common";
import { Router } from "express";

import {
  createMediaController,
  getMediaResourceController,
  getMediaResourceListController,
  updateMediaController,
} from "../controllers/media";
import { getUploadResourceController } from "../controllers/uploads";
import { mediaBodySchema, mediaResourceParamsSchema } from "../schemas";

const router = Router();

// router.post(
//   "/",
//   requireAuth,
//   validateRequest(ReqAttr.BODY, mediaBodySchema),
//   createMediaController,
// );

router.get("/", getUploadResourceController);

// router.get(
//   "/:mediaId",
//   validateRequest(ReqAttr.PARAMS, mediaResourceParamsSchema),
//   getMediaResourceController,
// );

// router.put(
//   "/:mediaId",
//   requireAuth,
//   validateRequest(ReqAttr.PARAMS, mediaResourceParamsSchema),
//   validateRequest(ReqAttr.BODY, mediaBodySchema),
//   updateMediaController,
// );

export { router as uploadRoutes };
