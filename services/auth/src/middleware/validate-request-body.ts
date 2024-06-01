import { RequestHandler } from 'express';
import Joi, { ValidationError } from 'joi';
import { RequestValidationError } from '../lib/http-error.js';

const validateRequestBody =
  (schema: Joi.ObjectSchema<unknown>): RequestHandler =>
  async (req, _res, next) => {
    try {
      const validated = await schema.validateAsync(req.body, {
        stripUnknown: true,
      });
      req.body = validated;
      next();
    } catch (err) {
      if ((err as ValidationError).isJoi) {
        return next(new RequestValidationError(err as ValidationError));
      }

      next(err);
    }
  };

export { validateRequestBody };
