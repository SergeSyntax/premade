import { injectCurrentUser } from "@devops-premade/ms-common";
import { Router } from "express";

import { healthRoutes } from "./health";
import { paymentsRoutes } from "./payments";

const router = Router();

// api/auth/health
router.use("/health", healthRoutes);
router.use("/", injectCurrentUser, paymentsRoutes);

export { router as routes };
