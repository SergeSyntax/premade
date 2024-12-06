import Joi from "joi";
import mongoose from "mongoose";

import { DonationReqBody, DonationResourceReqQuery } from "../types";

const text = Joi.string().min(3).max(255);
const objectId = text.custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new Error("invalid objectId");
  }
  return value;
});

export const donationBodySchema = Joi.object<DonationReqBody>({
  mediaId: objectId,
});

export const donationResourceParamsSchema = Joi.object<DonationResourceReqQuery>({
  donationId: objectId,
});
