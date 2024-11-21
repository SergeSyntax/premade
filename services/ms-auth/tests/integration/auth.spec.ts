import { expect, it } from "@jest/globals";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import request from "supertest";

import { app } from "../../src/app";
import { USER } from "../auth.mock";
import { TestRoutes } from "../consts";

it("returns a 201 on successful signup", async () => {
  return request(app).post(TestRoutes.REGISTER).send(USER).expect(StatusCodes.CREATED);
});

it("returns a 400 with an invalid email", async () => {
  return request(app)
    .post(TestRoutes.REGISTER)
    .send({
      email: "test",
      password: "password",
    })
    .expect(StatusCodes.BAD_REQUEST);
});

it("returns a 400 with missing attributes", async () => {
  return request(app).post(TestRoutes.REGISTER).send({}).expect(StatusCodes.BAD_REQUEST);
});

it("disallows duplicate emails", async () => {
  await request(app).post(TestRoutes.REGISTER).send(USER).expect(StatusCodes.CREATED);

  return request(app).post(TestRoutes.REGISTER).send(USER).expect(StatusCodes.BAD_REQUEST);
});

it("sets a cookie after successful signup", async () => {
  const response = await request(app).post(TestRoutes.REGISTER).send({
    email: "test@test.com",
    password: "password",
  });

  expect(response.get("Set-Cookie")).toBeDefined();
});

it("fails when a email that doesn't exist supplied", async () => {
  return request(app).post(TestRoutes.LOGIN).send(USER).expect(StatusCodes.BAD_REQUEST);
});

it("fails when an incorrect password supplied", async () => {
  await request(app).post(TestRoutes.REGISTER).send(USER).expect(StatusCodes.CREATED);

  return request(app)
    .post(TestRoutes.LOGIN)
    .send({
      email: "test@test.com",
      password: "wrongpassword",
    })
    .expect(StatusCodes.BAD_REQUEST);
});

it("responds with a cookie when given valid credentials", async () => {
  await request(app).post(TestRoutes.REGISTER).send(USER).expect(StatusCodes.CREATED);

  const response = await request(app).post(TestRoutes.LOGIN).send({
    email: "test@test.com",
    password: "password",
  });
  expect(response.get("Set-Cookie")).toBeDefined();
});

it("clears the cookie after signing out", async () => {
  await request(app).post(TestRoutes.REGISTER).send(USER).expect(StatusCodes.CREATED);

  const response = await request(app).post(TestRoutes.LOGOUT).send({});

  expect((response.get("Set-Cookie") as string[])[0]).toBe(
    "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly",
  );
});

it("response with details about the current user", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const cookie = await global.login(userId);

  const response = await request(app).get(TestRoutes.CURRENT_USER).set("Cookie", cookie).send();

  expect(response.body.user.id).toEqual(userId);
});

it("responds with null if not authenticated", async () => {
  const response = await request(app).get(TestRoutes.CURRENT_USER).send();

  expect(response.body.user).toEqual(null);
});
