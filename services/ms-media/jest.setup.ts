import { Buffer } from "node:buffer";

import { afterAll, beforeAll, beforeEach } from "@devops-premade/ms-common/tests/utils";
import { faker } from "@faker-js/faker";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";

import { app } from "./src/app";
import { JWT_SECRET } from "./src/config";
import { USER } from "./tests/auth.mock";
import { TestRoutes } from "./tests/consts";

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
  const collections = await mongoose.connection.db.collections();

  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close(true);
});
