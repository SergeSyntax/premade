import {
  BadRequestError,
  Currency,
  DonationStatus,
  NotAuthorizedError,
  NotFoundError,
} from "@devops-premade/ms-common";

import { Donation } from "../models";
import { stripe } from "../stripe";
import { PaymentReqBody } from "../types";

export const createPaymentService = async (payload: PaymentReqBody, userId: string) => {
  const donation = await Donation.findById(payload.donationId);

  if (!donation) throw new NotFoundError();
  if (donation.userId !== userId) throw new NotAuthorizedError();
  if (donation.status === DonationStatus.CANCELLED)
    throw new BadRequestError("Cannot pay for an cancelled donation");

  // docs: https://docs.stripe.com/api/charges/create

  await stripe.charges.create({
    amount: +donation.price * 100,
    currency: donation.currency,
    source: payload.token,
  });
};
