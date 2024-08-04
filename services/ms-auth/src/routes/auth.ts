import { injectCurrentUser, ReqAttr, validateRequest } from "@devops-premade/ms-common";
import { Router } from "express";

import { liveController } from "../controllers";
import {
  currentUserController,
  loginController,
  logoutController,
  registerController,
  verifyEmailController,
} from "../controllers/auth";
import { loginBodySchema, registerBodySchema, verifyEmailSchema } from "../schemas/login.schemas";

const router = Router();

// TODO: add swagger
router.post("/login", validateRequest(ReqAttr.BODY, loginBodySchema), loginController);
router.post("/register", validateRequest(ReqAttr.BODY, registerBodySchema), registerController);
router.post("/email", validateRequest(ReqAttr.BODY, verifyEmailSchema), verifyEmailController);
router.get("/current-user", injectCurrentUser, currentUserController);
router.get("/live", liveController);
router.post("/logout", logoutController);

export { router as authRoutes };
