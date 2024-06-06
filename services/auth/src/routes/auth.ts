import { Router } from "express";
import { liveController } from "../controllers";
import { ReqAttr, validateRequest } from "../middleware";
import { loginBodySchema, registerBodySchema } from "../schemas/login.schemas";
import { currentUserController, loginController, logoutController, registerController } from "../controllers/auth";
import { injectCurrentUser } from "../middleware/authentication-handler";

const router = Router();

// TODO: add swagger
router.post("/login", validateRequest(ReqAttr.BODY, loginBodySchema), loginController);
router.post("/register", validateRequest(ReqAttr.BODY, registerBodySchema), registerController);
router.get("/current-user", injectCurrentUser, currentUserController);
router.get("/live", liveController);
router.post('/logout', logoutController);

export { router as authRoutes };
