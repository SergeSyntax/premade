import {
  BadRequestError,
  DonationStatus,
  NotAuthorizedError,
  NotFoundError,
} from "@media-premade/ms-common";

import { PaymentCreatedPublisher } from "../events/publishers";
import { messageBusClient } from "../message-bus-client";
import { Donation } from "../models";
import { Payment } from "../models/payment";
import { stripe } from "../stripe";
import { PaymentReqBody } from "../types";

export const createPaymentService = async (payload: PaymentReqBody, userId: string) => {
  const donation = await Donation.findById(payload.donationId);

  if (!donation) throw new NotFoundError();
  if (donation.userId !== userId) throw new NotAuthorizedError();
  if (donation.status === DonationStatus.CANCELLED)
    throw new BadRequestError("Cannot pay for an cancelled donation");

  // docs: https://docs.stripe.com/api/charges/create

  const { id: stripeId } = await stripe.charges.create({
    amount: +donation.price * 100,
    currency: donation.currency,
    source: payload.token,
  });

  const payment = new Payment({
    donationId: donation.id,
    stripeId,
  });

  await payment.save();

  await new PaymentCreatedPublisher(messageBusClient.channelWrapper).publish({
    id: payment.id,
    stripeId: payment.stripeId,
    donationId: payment.donationId,
  });

  return payment.id;
};
