import Joi from "joi";

import { MediaReqBody, MediaResourceReqQuery } from "../types";

const text = Joi.string().min(3).max(255);
export const mediaBodySchema = Joi.object<MediaReqBody>({
  title: text.required(),
  description: text,
});

export const mediaResourceParamsSchema = Joi.object<MediaResourceReqQuery>({
  mediaId: text.required(),
});
