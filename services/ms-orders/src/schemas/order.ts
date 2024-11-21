import Joi from "joi";
import mongoose from "mongoose";

import { OrderReqBody, OrderResourceReqQuery } from "../types";

const text = Joi.string().min(3).max(255);
const objectId = text.custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    console.log("helpers.state.ancestors", JSON.stringify(helpers));

    throw new Error("invalid objectId");
  }
  return value;
});

export const orderBodySchema = Joi.object<OrderReqBody>({
  mediaId: objectId,
});

export const orderResourceParamsSchema = Joi.object<OrderResourceReqQuery>({
  orderId: objectId,
});
