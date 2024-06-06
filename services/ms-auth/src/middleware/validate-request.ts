import { RequestHandler } from "express";
import Joi, { ValidationError } from "joi";

import { RequestValidationError } from "../lib/http-error";

enum ReqAttr {
  BODY = "body",
  PARAMS = "params",
  QUERY = "query",
}

const validateRequest =
  (
    requestAttribute: ReqAttr,
    schema: Joi.ObjectSchema<unknown>,
  ): RequestHandler =>
  async (req, _res, next) => {
    try {
      // eslint-disable-next-line security/detect-object-injection
      const validated = await schema.validateAsync(req[requestAttribute], {
        stripUnknown: true,
      });
      // eslint-disable-next-line security/detect-object-injection
      req[requestAttribute] = validated;
      next();
    } catch (err) {
      if ((err as ValidationError).isJoi) {
        return next(new RequestValidationError(err as ValidationError));
      }

      next(err);
    }
  };

export { ReqAttr,validateRequest };
