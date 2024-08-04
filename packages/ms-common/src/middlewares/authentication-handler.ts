import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

import * as env from "../config";
import { NotAuthorizedError } from "../errors";
import { logger } from "../logger";

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

export const injectCurrentUser: RequestHandler = (req, _res, next) => {
  if (!req.session?.jwt) return next();

  try {
    const payload = jwt.verify(req.session.jwt, env.JWT_SECRET) as UserPayload;
    req.currentUser = payload;
  } catch (err) {
    logger.debug("failed to inject user", err);
  }
  next();
};

export const requireAuth: RequestHandler = (req, res, next) => {
  if (!req.currentUser) throw new NotAuthorizedError();
  next();
};
