import { describe, expect, it, jest } from "@jest/globals";
import { Currency, DonationStatus } from "@media-premade/ms-common";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import request from "supertest";

import { stripe } from "../../__mocks__/stripe";
import { app } from "../../src/app";
import { messageBusClient } from "../../src/message-bus-client";
import { Donation } from "../../src/models";
import { Payment } from "../../src/models/payment";

describe("payment create", () => {
  const createDonation = (attrs: { status?: DonationStatus; version?: number } = {}) =>
    new Donation({
      _id: new mongoose.Types.ObjectId().toHexString(),
      userId: new mongoose.Types.ObjectId().toHexString(),
      version: attrs.version ?? 0,
      price: 20,
      currency: Currency.USD,
      status: attrs.status ?? DonationStatus.CREATED,
    });

  it("throw 404 when purchasing an donation that does no exist", async () => {
    await request(app).post("/api/payments").set("Cookie", global.login()).send({
      token: "test",
      orderId: new mongoose.Types.ObjectId().toHexString(),
    });
  });
  it("throw 401 when purchasing an donation that doesn't belong to the user", async () => {
    const donation = createDonation();
    await donation.save();
    await request(app)
      .post("/api/payments")
      .set("Cookie", global.login())
      .send({
        token: "test",
        donationId: donation._id!.toHexString(),
      })
      .expect(StatusCodes.UNAUTHORIZED);
  });

  it("throw 400 when purchasing a cancelled order", async () => {
    const donation = createDonation({ status: DonationStatus.CANCELLED, version: 1 });
    await donation.save();
    await request(app)
      .post("/api/payments")
      .set("Cookie", global.login(donation.userId))
      .send({
        token: "test",
        donationId: donation._id!.toHexString(),
      })
      .expect(StatusCodes.BAD_REQUEST);
  });
  it("returns a 204 with valid inputs", async () => {
    const donation = createDonation();
    await donation.save();
    await request(app)
      .post("/api/payments")
      .set("Cookie", global.login(donation.userId))
      .send({
        token: "tok_visa",
        donationId: donation._id.toHexString(),
      })
      .expect(StatusCodes.CREATED);

    expect(stripe.charges.create).toBeCalledWith({
      amount: donation.price * 100,
      currency: donation.currency,
      source: "tok_visa",
    });

    const payment = await Payment.findOne({
      donationId: donation.id,
    });

    expect(payment).not.toBeNull();

    expect(messageBusClient.channelWrapper.publish).toHaveBeenCalled()
  });
});
