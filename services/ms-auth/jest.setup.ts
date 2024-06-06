import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from './src/app';
import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { beforeAll, beforeEach, afterAll } from '@premade/ms-common/tests/utils';
import { USER } from './tests/auth.mock';
import { TestRoutes } from './tests/consts';

declare global {
  var login: () => Promise<string>;
}

global.login = async () => {
  const response = await request(app).post(TestRoutes.REGISTER).send({
    email: USER.email,
    password: USER.password,
  }).expect(StatusCodes.CREATED);
  
  const cookie = (response?.get('Set-Cookie') as string[])[0];
  return cookie;
};

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close(true);
});
