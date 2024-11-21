import { faker } from "@faker-js/faker";
import { describe, expect, it, jest } from "@jest/globals";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import request from "supertest";

import { messageBusClient } from "../../__mocks__/message-bus-client";
import { app } from "../../src/app";
import { order } from "../../src/models";
import { USER } from "../auth.mock";
import { TestRoutes } from "../consts";

const createorder = async () => {
  const response = await request(app)
    .post(TestRoutes.order)
    .set("Cookie", global.login())
    .send({
      title: faker.internet.domainName(),
      description: faker.lorem.paragraph(1),
    });

  return response.body.order;
};

describe("create order", () => {
  it("has a route handler listening to /api/order for post requests", async () => {
    const response = await request(app).post(TestRoutes.order).send({});

    expect(response.status).not.toEqual(404);
  });

  it("can only be accessed if the user is signed in", async () => {
    await request(app).post(TestRoutes.order).send({}).expect(401);

    const cookies = global.login();

    const response = await request(app).post(TestRoutes.order).set("Cookie", cookies).send({});
    expect(response.status).not.toEqual(StatusCodes.UNAUTHORIZED);
  });

  it("reruns an error if an invalid title is provided", async () => {
    const cookies = global.login();

    const response = await request(app).post(TestRoutes.order).set("Cookie", cookies).send({});
    expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
  });

  it("publishes an event on order creation", async () => {
    const title = faker.internet.domainName();
    const cookies = global.login();

    await request(app)
      .post(TestRoutes.order)
      .set("Cookie", cookies)
      .send({
        title,
        description: faker.lorem.paragraph(1),
      })
      .expect(StatusCodes.CREATED);

    expect(messageBusClient.channelWrapper.publish).toHaveBeenCalled();
  });

  it("creates a order with valid input", async () => {
    const title = faker.internet.domainName();
    const cookies = global.login();
    let orderResources = await order.find({});
    expect(orderResources.length).toBe(0);

    await request(app)
      .post(TestRoutes.order)
      .set("Cookie", cookies)
      .send({
        title,
        description: faker.lorem.paragraph(1),
      })
      .expect(StatusCodes.CREATED);

    orderResources = await order.find({});
    expect(orderResources[0].title).toEqual(title);
    expect(orderResources.length).toBe(1);
  });
});

describe("get order by id", () => {
  it("returns a 404 if the order is not found", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app).get(`${TestRoutes.order}/${id}`).send().expect(404);
  });

  it("returns the order if the order is found", async () => {
    const title = faker.internet.domainName();
    const cookies = global.login();

    const response = await request(app)
      .post(TestRoutes.order)
      .set("Cookie", cookies)
      .send({
        title,
        description: faker.lorem.paragraph(1),
      })
      .expect(StatusCodes.CREATED);

    const orderResponse = await request(app)
      .get(`${TestRoutes.order}/${response.body.order.id}`)
      .send()
      .expect(StatusCodes.OK);

    expect(orderResponse.body.order.title).toEqual(title);
  });
});

describe("get order list", () => {
  it("fetch a list of order resources", async () => {
    const orderLength = 2;

    for (let i = 0; i < orderLength; i++) {
      await createorder();
    }

    const response = await request(app).get(TestRoutes.order).send().expect(StatusCodes.OK);

    expect(response.body.orders.length).toEqual(orderLength);
  });
});

describe("update order by id", () => {
  it("returns 404 if provided invalid id", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
      .put(`${TestRoutes.order}/${id}`)
      .set("Cookie", global.login())
      .send({
        title: faker.internet.userName(),
        description: faker.lorem.paragraph(1),
      })
      .expect(StatusCodes.NOT_FOUND);
  });
  it("returns a 401 if the user not authenticated", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
      .put(`${TestRoutes.order}/${id}`)
      .send({
        title: faker.internet.userName(),
        description: faker.lorem.paragraph(1),
      })
      .expect(StatusCodes.UNAUTHORIZED);
  });
  it("return 401 if the user does not own the video", async () => {
    const order = await createorder();

    const resource = await request(app)
      .put(`${TestRoutes.order}/${order.id}`)
      .set("Cookie", global.login())
      .send({
        title: faker.internet.userName(),
        description: faker.lorem.paragraph(1),
      });
  });
  it("return 400 if the user provides an invalid title", async () => {
    const order = new order({
      title: faker.internet.userName(),
      description: faker.lorem.paragraph(1),
      userId: new mongoose.Types.ObjectId().toHexString(),
    });
    const id = order.id;

    await order.save();

    await request(app)
      .put(`${TestRoutes.order}/${id}`)
      .set("Cookie", global.login())
      .send()
      .expect(StatusCodes.BAD_REQUEST);
  });

  it("updated the order provided valid inputs", async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const title = faker.internet.userName();
    const description = faker.lorem.paragraph(1);

    const order = new order({
      title: faker.internet.userName(),
      description: faker.lorem.paragraph(1),
      userId,
    });
    const id = order.id;

    await order.save();

    const response = await request(app)
      .put(`${TestRoutes.order}/${id}`)
      .set("Cookie", global.login(userId))
      .send({
        title,
        description,
      })
      .expect(StatusCodes.OK);

    expect(response.body.order.title).toEqual(title);
    expect(response.body.order.description).toEqual(description);
  });
});
