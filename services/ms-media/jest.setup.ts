import { Buffer } from "node:buffer";

import { afterAll, beforeAll, beforeEach, jest } from "@jest/globals";

import { messageBusClient } from "./__mocks__/message-bus-client";

jest.unstable_mockModule("./src/message-bus-client", () => ({
  messageBusClient: messageBusClient,
}));

import { faker } from "@faker-js/faker";
import jwt from "jsonwebtoken";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

import { JWT_SECRET } from "./src/config";

declare global {
  // eslint-disable-next-line no-var
  var login: (id?: mongoose.Types.ObjectId | string) => string[];
}

// Generate a Mongoose ObjectId
const generateObjectId = () => {
  return new mongoose.Types.ObjectId();
};

global.login = (id) => {
  const payload = {
    id: id ?? generateObjectId(),
    email: faker.internet.email({ firstName: "test" }),
  };

  const token = jwt.sign(payload, JWT_SECRET);
  const session = JSON.stringify({ jwt: token });

  const base64 = Buffer.from(session).toString("base64");

  return [`session=${base64}`];
};

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close(true);
});
