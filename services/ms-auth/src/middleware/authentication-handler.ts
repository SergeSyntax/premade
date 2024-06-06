import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

import { JWT_SECRET } from "../config/env";
import { NotAuthorizedError } from "../lib/http-error";
import { logger } from "../utils";

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
    const payload = jwt.verify(req.session.jwt, JWT_SECRET) as UserPayload;
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
