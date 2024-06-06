import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { app } from '../../src/app';
import { expect, it } from '@premade/ms-common/tests/utils';
import { USER } from '../auth.mock';
import { TestRoutes } from '../consts';

it('returns a 201 on successful signup', async () => {
  return request(app)
    .post(TestRoutes.REGISTER)
    .send(USER)
    .expect(StatusCodes.CREATED);
});

it('returns a 400 with an invalid email', async () => {
  return request(app)
    .post(TestRoutes.REGISTER)
    .send({
      email: 'test',
      password: 'password',
    })
    .expect(StatusCodes.BAD_REQUEST);
});

it('returns a 400 with missing attributes', async () => {
  return request(app).post(TestRoutes.REGISTER).send({}).expect(StatusCodes.BAD_REQUEST);
});

it('disallows duplicate emails', async () => {
  await request(app)
    .post(TestRoutes.REGISTER)
    .send(USER)
    .expect(StatusCodes.CREATED);

  return request(app)
    .post(TestRoutes.REGISTER)
    .send(USER)
    .expect(StatusCodes.BAD_REQUEST);
});

it('sets a cookie after successful signup', async () => {
  const response = await request(app).post(TestRoutes.REGISTER).send({
    email: 'test@test.com',
    password: 'password',
  });

  expect(response.get('Set-Cookie')).toBeDefined();
});

it("fails when a email that doesn't exist supplied", async () => {
  return request(app)
    .post('/api/auth/login')
    .send(USER)
    .expect(StatusCodes.BAD_REQUEST);
});

it('fails when an incorrect password supplied', async () => {
  await request(app)
    .post(TestRoutes.REGISTER)
    .send(USER)
    .expect(StatusCodes.CREATED);

  return request(app)
    .post('/api/auth/login')
    .send({
      email: 'test@test.com',
      password: 'wrongpassword',
    })
    .expect(StatusCodes.BAD_REQUEST);
});

it('responds with a cookie when given valid credentials', async () => {
  await request(app)
    .post(TestRoutes.REGISTER)
    .send(USER)
    .expect(StatusCodes.CREATED);

  const response = await request(app).post('/api/auth/login').send({
    email: 'test@test.com',
    password: 'password',
  });
  expect(response.get('Set-Cookie')).toBeDefined();
});

it('clears the cookie after signing out', async () => {
  await request(app)
    .post(TestRoutes.REGISTER)
    .send(USER)
    .expect(StatusCodes.CREATED);

  const response = await request(app).post('/api/auth/logout').send({});

  expect((response.get('Set-Cookie') as string[])[0]).toBe(
    'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly',
  );
});

it('response with details about the current user', async () => {
  const cookie = await global.login();

  const response = await request(app).get(TestRoutes.CURRENT_USER).set('Cookie', cookie).send();

  expect(response.body.user.email).toEqual(USER.email);
});

it('responds with null if not authenticated', async () => {
  const response = await request(app).get(TestRoutes.CURRENT_USER).send();

  expect(response.body.user).toEqual(null);
});
