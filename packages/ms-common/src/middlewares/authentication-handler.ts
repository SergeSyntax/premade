import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

import { NotAuthorizedError } from "../errors";
import { CustomLogger } from "../logger/types";

interface UserPayload {
  id: string;
  email: string;
}

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const generateAuthMiddlewares = (
  logger: CustomLogger,
  jwtSecret: string,
): { requireAuth: RequestHandler; injectCurrentUser: RequestHandler } => {
  const injectCurrentUser: RequestHandler = (req, _res, next) => {
    if (!req.session?.jwt) return next();

    try {
      const payload = jwt.verify(req.session.jwt, jwtSecret) as UserPayload;
      req.currentUser = payload;
    } catch (err) {
      logger.debug("failed to inject user", err);
    }
    next();
  };

  const requireAuth: RequestHandler = (req, res, next) => {
    if (!req.currentUser) throw new NotAuthorizedError();
    next();
  };

  return { injectCurrentUser, requireAuth };
};
