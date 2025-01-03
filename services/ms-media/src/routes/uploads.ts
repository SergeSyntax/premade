import { ReqAttr, validateRequest } from "@media-premade/ms-common";
import { Router } from "express";

import {
  getThumbnailUploadResourceController,
  getVideoUploadResourceController,
} from "../controllers/uploads";
import { uploadResourceParamsSchema } from "../schemas/uploads";

const router = Router();

router.get(
  "/video",
  validateRequest(ReqAttr.QUERY, uploadResourceParamsSchema),
  getVideoUploadResourceController,
);

router.get(
  "/thumbnail",
  validateRequest(ReqAttr.QUERY, uploadResourceParamsSchema),
  getThumbnailUploadResourceController,
);

export { router as uploadRoutes };
