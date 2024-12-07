import { Currency, DonationStatus, PaymentModels, Visibility } from "@devops-premade/ms-common";
import { faker } from "@faker-js/faker";
import { describe, expect, it, jest } from "@jest/globals";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import request from "supertest";

import { messageBusClient } from "../../__mocks__/message-bus-client";
import { app } from "../../src/app";
import { Donation, Media } from "../../src/models";
import { TestRoutes } from "../consts";

const buildMediaItems = async () => {
  const media = new Media({
    title: faker.company.name(),
    price: faker.number.int({ max: 200, min: 100 }),
    currency: Currency.USD,
    visibility: Visibility.PUBLIC,
    paymentModel: PaymentModels.PURCHASE,
  });
  await media.save();

  return media;
};

describe("donations create", () => {
  it("returns an error if the ticket does not exist", async () => {
    const ticketId = new mongoose.Types.ObjectId();

    await request(app)
      .post(TestRoutes.DONATIONS)
      .set("Cookie", global.login())
      .send({
        ticketId,
      })
      .expect(StatusCodes.NOT_FOUND);
  });

  it("return an error if you can't donate to the media", async () => {
    const userId = new mongoose.Types.ObjectId();
    const media = new Media({
      title: "test",
      price: 20,
      currency: Currency.USD,
      visibility: Visibility.UNLISTED,
      paymentModel: PaymentModels.PURCHASE,
    });

    await media.save();

    const donation = new Donation({
      userId,
      media,
      status: DonationStatus.CREATED,
      expiresAt: new Date(),
    });
    await donation.save();

    await request(app)
      .post(TestRoutes.DONATIONS)
      .set("Cookie", global.login(userId))
      .send({
        mediaId: media.id,
      })
      .expect(StatusCodes.BAD_REQUEST);
  });

  it("returned created donation for an existing media item", async () => {
    const media = await buildMediaItems();

    const userId = new mongoose.Types.ObjectId();

    const donation = new Donation({
      userId,
      media,
      status: DonationStatus.CREATED,
      expiresAt: new Date(),
    });
    await donation.save();

    await request(app)
      .post(TestRoutes.DONATIONS)
      .set("Cookie", global.login(userId))
      .send({
        mediaId: media.id,
      })
      .expect(StatusCodes.CREATED);
  });

  it("emits an donation created event", async () => {
    const media = await buildMediaItems();

    const userId = new mongoose.Types.ObjectId();

    const donation = new Donation({
      userId,
      media,
      status: DonationStatus.CREATED,
      expiresAt: new Date(),
    });
    await donation.save();

    await request(app)
      .post(TestRoutes.DONATIONS)
      .set("Cookie", global.login(userId))
      .send({
        mediaId: media.id,
      })
      .expect(StatusCodes.CREATED);

    expect(messageBusClient.channelWrapper.publish).toHaveBeenCalled()
  });
});

describe("donations fetch list", () => {
  it("fetches donations for an particular user", async () => {
    const mediaOne = await buildMediaItems();
    const mediaTwo = await buildMediaItems();
    const mediaThree = await buildMediaItems();

    const userOne = global.login();
    const userTwo = global.login();

    const donationOne = await request(app)
      .post(TestRoutes.DONATIONS)
      .set("Cookie", userOne)
      .send({
        mediaId: mediaOne.id,
      })
      .expect(StatusCodes.CREATED);

    const donationTwo = await request(app)
      .post(TestRoutes.DONATIONS)
      .set("Cookie", userTwo)
      .send({
        mediaId: mediaTwo.id,
      })
      .expect(StatusCodes.CREATED);

    const donationThree = await request(app)
      .post(TestRoutes.DONATIONS)
      .set("Cookie", userTwo)
      .send({
        mediaId: mediaThree.id,
      })
      .expect(StatusCodes.CREATED);

    const res = await request(app)
      .get(TestRoutes.DONATIONS)
      .set("Cookie", userTwo)
      .send()
      .expect(StatusCodes.OK);

    const isDonationOneIncluded = (res.body.donations as []).find(
      ({ id }) => donationOne.body.donation.id === id,
    );

    const isDonationTwoIncluded = (res.body.donations as []).find(
      ({ id }) => donationTwo.body.donation.id === id,
    );
    const isDonationThreeIncluded = (res.body.donations as []).find(
      ({ id }) => donationThree.body.donation.id === id,
    );

    expect(res.body.donations.length).toBe(2);
    expect(isDonationOneIncluded).toBeUndefined();
    expect(isDonationTwoIncluded).toBeDefined();
    expect(isDonationThreeIncluded).toBeDefined();
  });
});
describe("donation fetch by id", () => {
  it("returns a donation if user is auth and donation exists", async () => {
    const media = await buildMediaItems();

    const userId = new mongoose.Types.ObjectId();

    const donation = new Donation({
      userId,
      media,
      status: DonationStatus.CREATED,
      expiresAt: new Date(),
    });
    await donation.save();

    const { body: createdDonation } = await request(app)
      .post(TestRoutes.DONATIONS)
      .set("Cookie", global.login(userId))
      .send({
        mediaId: media.id,
      })
      .expect(StatusCodes.CREATED);

    const createdDonationId = createdDonation.donation.id;

    const { body: fetchedDonation } = await request(app)
      .get(`${TestRoutes.DONATIONS}/${createdDonationId}`)
      .set("Cookie", global.login(userId))
      .send()
      .expect(StatusCodes.OK);

    expect(fetchedDonation.donation.id).toBe(createdDonationId);
  });

  it("returns auth error if the donation belong to a different user", async () => {
    const media = await buildMediaItems();

    const userId = new mongoose.Types.ObjectId();
    const irrelevantUserId = new mongoose.Types.ObjectId();

    const donation = new Donation({
      userId,
      media,
      status: DonationStatus.CREATED,
      expiresAt: new Date(),
    });
    await donation.save();

    const { body: createdDonation } = await request(app)
      .post(TestRoutes.DONATIONS)
      .set("Cookie", global.login(userId))
      .send({
        mediaId: media.id,
      })
      .expect(StatusCodes.CREATED);

    const createdDonationId = createdDonation.donation.id;

    await request(app)
      .get(`${TestRoutes.DONATIONS}/${createdDonationId}`)
      .set("Cookie", global.login(irrelevantUserId))
      .send()
      .expect(StatusCodes.UNAUTHORIZED);
  });
});

describe("donation cancelled by id", () => {
  it("returns success on donation cancellation", async () => {
    // #region create donation
    const media = await buildMediaItems();

    const userId = new mongoose.Types.ObjectId();

    const donation = new Donation({
      userId,
      media,
      status: DonationStatus.CREATED,
      expiresAt: new Date(),
    });
    await donation.save();

    const { body: createdDonation } = await request(app)
      .post(TestRoutes.DONATIONS)
      .set("Cookie", global.login(userId))
      .send({
        mediaId: media.id,
      })
      .expect(StatusCodes.CREATED);

    const createdDonationId = createdDonation.donation.id;
    // #endregion

    // #region cancel donation
    await request(app)
      .patch(`${TestRoutes.DONATIONS}/${createdDonationId}`)
      .set("Cookie", global.login(userId))
      .send()
      .expect(StatusCodes.NO_CONTENT);
    // #endregion

    const { body: fetchedDonation } = await request(app)
      .get(`${TestRoutes.DONATIONS}/${createdDonationId}`)
      .set("Cookie", global.login(userId))
      .send()
      .expect(StatusCodes.OK);

    expect(fetchedDonation.donation.id).toBe(createdDonationId);
    expect(fetchedDonation.donation.status).toBe(DonationStatus.CANCELLED);
  });

  it("emits a donation cancelled event", async () => {
    // #region create donation
    const media = await buildMediaItems();

    const userId = new mongoose.Types.ObjectId();

    const donation = new Donation({
      userId,
      media,
      status: DonationStatus.CREATED,
      expiresAt: new Date(),
    });
    await donation.save();

    const { body: createdDonation } = await request(app)
      .post(TestRoutes.DONATIONS)
      .set("Cookie", global.login(userId))
      .send({
        mediaId: media.id,
      })
      .expect(StatusCodes.CREATED);

    const createdDonationId = createdDonation.donation.id;
    // #endregion

    // #region cancel donation
    await request(app)
      .patch(`${TestRoutes.DONATIONS}/${createdDonationId}`)
      .set("Cookie", global.login(userId))
      .send()
      .expect(StatusCodes.NO_CONTENT);
    // #endregion

    const { body: fetchedDonation } = await request(app)
      .get(`${TestRoutes.DONATIONS}/${createdDonationId}`)
      .set("Cookie", global.login(userId))
      .send()
      .expect(StatusCodes.OK);

    expect(fetchedDonation.donation.id).toBe(createdDonationId);
    expect(fetchedDonation.donation.status).toBe(DonationStatus.CANCELLED);


    expect(messageBusClient.channelWrapper.publish).toHaveBeenCalled()
  });
});
