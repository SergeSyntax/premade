import { Router } from "express";

import { liveController } from "../controllers";
import {
  currentUserController,
  verifyEmailController,
  loginController,
  logoutController,
  registerController,
} from "../controllers/auth";
import { ReqAttr, validateRequest } from "../middleware";
import { injectCurrentUser } from "../middleware/authentication-handler";
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
