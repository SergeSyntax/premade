import { faker } from "@faker-js/faker";
import { describe, expect, it, jest } from "@jest/globals";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import request from "supertest";

import { messageBusClient } from "../../__mocks__/message-bus-client";
import { app } from "../../src/app";
import { Media } from "../../src/models";
import { TestRoutes } from "../consts";
import { generateMedia } from "../utils/media";

const createMedia = async (title?: string) => {
  const response = await request(app)
    .post(TestRoutes.MEDIA)
    .set("Cookie", global.login())
    .send(generateMedia(title));

  return response.body.media;
};

describe("create media", () => {
  it("has a route handler listening to /api/media for post requests", async () => {
    const response = await request(app).post(TestRoutes.MEDIA).send({});

    expect(response.status).not.toEqual(StatusCodes.NOT_FOUND);
  });

  it("can only be accessed if the user is signed in", async () => {
    await request(app).post(TestRoutes.MEDIA).send({}).expect(StatusCodes.UNAUTHORIZED);

    const cookies = global.login();

    const response = await request(app).post(TestRoutes.MEDIA).set("Cookie", cookies).send({});
    expect(response.status).not.toEqual(StatusCodes.UNAUTHORIZED);
  });

  it("reruns an error if an invalid title is provided", async () => {
    const cookies = global.login();

    const response = await request(app).post(TestRoutes.MEDIA).set("Cookie", cookies).send({});
    expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
  });

  it("publishes an event on media creation", async () => {
    const title = faker.internet.domainName();
    const cookies = global.login();

    await request(app)
      .post(TestRoutes.MEDIA)
      .set("Cookie", cookies)
      .send(generateMedia(title))
      .expect(StatusCodes.CREATED);

    expect(messageBusClient.channelWrapper.publish).toHaveBeenCalled();
  });

  it("creates a media with valid input", async () => {
    const title = faker.internet.domainName();
    const cookies = global.login();
    let mediaResources = await Media.find({});
    expect(mediaResources.length).toBe(0);

    await request(app)
      .post(TestRoutes.MEDIA)
      .set("Cookie", cookies)
      .send(generateMedia(title))
      .expect(StatusCodes.CREATED);

    mediaResources = await Media.find({});
    expect(mediaResources[0].title).toEqual(title);
    expect(mediaResources.length).toBe(1);
  });
});

describe("get media by id", () => {
  it("returns a 404 if the media is not found", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app).get(`${TestRoutes.MEDIA}/${id}`).send().expect(StatusCodes.NOT_FOUND);
  });

  it("returns the media if the media is found", async () => {
    const title = faker.internet.domainName();
    const cookies = global.login();

    const response = await request(app)
      .post(TestRoutes.MEDIA)
      .set("Cookie", cookies)
      .send(generateMedia(title))
      .expect(StatusCodes.CREATED);

    const mediaResponse = await request(app)
      .get(`${TestRoutes.MEDIA}/${response.body.media.id}`)
      .send()
      .expect(StatusCodes.OK);

    expect(mediaResponse.body.media.title).toEqual(title);
  });
});

describe("get media list", () => {
  it("fetch a list of media resources", async () => {
    const mediaLength = 2;

    for (let i = 0; i < mediaLength; i++) {
      await createMedia();
    }

    const response = await request(app).get(TestRoutes.MEDIA).send().expect(StatusCodes.OK);

    expect(response.body.medias.length).toEqual(mediaLength);
  });
});

describe("update media by id", () => {
  it("returns 404 if provided invalid id", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
      .put(`${TestRoutes.MEDIA}/${id}`)
      .set("Cookie", global.login())
      .send(generateMedia())
      .expect(StatusCodes.NOT_FOUND);
  });
  it("returns a 401 if the user not authenticated", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
      .put(`${TestRoutes.MEDIA}/${id}`)
      .send(generateMedia())
      .expect(StatusCodes.UNAUTHORIZED);
  });
  it("return 401 if the user does not own the video", async () => {
    const media = await createMedia();

    await request(app)
      .put(`${TestRoutes.MEDIA}/${media.id}`)
      .set("Cookie", global.login())
      .send({
        title: faker.internet.userName(),
        description: faker.lorem.paragraph(1),
        thumbnailUrl: faker.internet.url(),
        videoUrl: faker.internet.url(),
      })
      .expect(StatusCodes.UNAUTHORIZED);
  });

  it("updated the media provided valid inputs", async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const title = faker.internet.userName();
    const description = faker.lorem.paragraph(1);

    const media = new Media({
      ...generateMedia(title),
      userId,
    });
    const id = media.id;

    await media.save();

    const response = await request(app)
      .put(`${TestRoutes.MEDIA}/${id}`)
      .set("Cookie", global.login(userId))
      .send({
        title,
        description,
      })
      .expect(StatusCodes.OK);

    expect(response.body.media.title).toEqual(title);
    expect(response.body.media.description).toEqual(description);
  });

  it("publish an update event on update rest", async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const title = faker.internet.userName();
    const description = faker.lorem.paragraph(1);

    const media = new Media({
      ...generateMedia(title),
      userId,
    });
    const id = media.id;

    await media.save();

    await request(app)
      .put(`${TestRoutes.MEDIA}/${id}`)
      .set("Cookie", global.login(userId))
      .send({
        title,
        description,
      })
      .expect(StatusCodes.OK);

    expect(messageBusClient.channelWrapper.publish).toHaveBeenCalled();

  });

  it("reject updates if the media is reserved", async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const title = faker.internet.userName();
    const description = faker.lorem.paragraph(1);

    const media = new Media({
      ...generateMedia(title),
      donationInProgress: true,
      userId,
    });
    const id = media.id;

    await media.save();

    await request(app)
      .put(`${TestRoutes.MEDIA}/${id}`)
      .set("Cookie", global.login(userId))
      .send({
        title,
        description,
      })
      .expect(StatusCodes.BAD_REQUEST);
  })
});
