import { Router } from "express";

import { authRoutes } from "./auth";
import { healthRoutes } from "./health";

const router = Router();

// api/auth/health
router.use("/health", healthRoutes);
router.use("/", authRoutes);

export { router as routes };
