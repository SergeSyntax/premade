import jwt from 'jsonwebtoken';
import { RequestHandler } from 'express';
import { NotAuthorizedError } from '../lib/http-error.js';
import { JWT_SECRET } from '../config/env.js';

interface UserPayload {
  id: string;
  email: string;
}

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
  } catch (err) {}
  next();
};

export const requireAuth: RequestHandler = (req, res, next) => {
  if (!req.currentUser) throw new NotAuthorizedError();
  next();
};
