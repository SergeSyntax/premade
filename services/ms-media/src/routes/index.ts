import { injectCurrentUser } from "@media-premade/ms-common";
import { Router } from "express";
import swaggerUi from "swagger-ui-express";

import { swaggerSpec } from "../swagger.config";
import { healthRoutes } from "./health";
import { mediaRoutes } from "./media";
import { uploadRoutes } from "./uploads";

const router = Router();

// api/auth/health
router.use("/health", healthRoutes);
router.use("/uploads", injectCurrentUser, uploadRoutes);
router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

router.use("/", injectCurrentUser, mediaRoutes);

export { router as routes };
