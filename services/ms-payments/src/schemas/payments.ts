import Joi from "joi";

import { PaymentReqBody } from "../types";
import { text } from "./common";

export const paymentBodySchema = Joi.object<PaymentReqBody>({
  donationId: text.required(),
  token: text.required(),
});
