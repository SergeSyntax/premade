import Joi from "joi";

import { Currency, MediaReqBody, MediaResourceReqQuery, PaymentModels, Visibility } from "../types";
import { enumeration, text } from "./common";

export const mediaBodySchema = Joi.object<MediaReqBody>({
  title: text.required(),
  description: Joi.string().empty(''),
  currency: enumeration(Currency),
  isUploaded: Joi.bool(),
  paymentModel: enumeration(PaymentModels),
  price: Joi.number(),
  scheduledDate: Joi.date().optional(),
  thumbnailUrl: text.required(),
  visibility: enumeration(Visibility),
});

export const mediaResourceParamsSchema = Joi.object<MediaResourceReqQuery>({
  mediaId: text.required(),
});
