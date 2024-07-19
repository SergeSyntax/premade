import { generateAuthMiddlewares } from "@devops-premade/ms-common";

import { JWT_SECRET } from "../config";
import { logger } from "../utils";

export const { injectCurrentUser, requireAuth } = generateAuthMiddlewares(logger, JWT_SECRET);
