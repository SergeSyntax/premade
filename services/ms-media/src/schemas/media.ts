import { Currency, PaymentModels, Visibility } from "@media-premade/ms-common/lib/enums";
import Joi from "joi";

import { MediaReqBody, MediaResourceReqQuery } from "../types";
import { enumeration, text } from "./common";

export const mediaBodySchema = Joi.object<MediaReqBody>({
  title: text.required(),
  description: Joi.string().empty(""),
  currency: enumeration(Currency),
  isUploaded: Joi.bool(),
  paymentModel: enumeration(PaymentModels),
  price: Joi.number(),
  scheduledDate: Joi.date().optional(),
  videoUrl: text.required(),
  thumbnailUrl: text.required(),
  visibility: enumeration(Visibility),
});

export const mediaUpdateBodySchema = Joi.object<MediaReqBody>({
  title: text.optional(),
  description: Joi.string().empty("").optional(),
});

export const mediaResourceParamsSchema = Joi.object<MediaResourceReqQuery>({
  mediaId: text.required(),
});
