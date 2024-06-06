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
      const validated = await schema.validateAsync(req[requestAttribute], {
        stripUnknown: true,
      });
      req[requestAttribute] = validated;
      next();
    } catch (err) {
      if ((err as ValidationError).isJoi) {
        return next(new RequestValidationError(err as ValidationError));
      }

      next(err);
    }
  };

export { validateRequest, ReqAttr };
