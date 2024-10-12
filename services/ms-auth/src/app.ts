import "express-async-errors";

import dotenv from "dotenv";

dotenv.config({
  // services/auth/.env
  path: ".env",
});

import {
  Env,
  errorRequestHandler,
  httpLogMiddleware,
  notFoundController,
} from "@devops-premade/ms-common";
import cookieSession from "cookie-session";
import cors from "cors";
import express from "express";

import * as env from "./config/env";
import { Routes } from "./routes";

const app = express();
// traffic proxy through istio-ingress
// express don't trust to ssl on proxy by default
app.set("trust proxy", true);
app.use(express.json({ limit: "100kb" }));
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  }),
);
// change secure to use ssl
app.use(
  cookieSession({
    // jwt is already encrypted and can't be tempered
    signed: false,
    // check that the user use https connection
    secure: env.NODE_ENV === Env.Production,
  }),
);
app.use(httpLogMiddleware);
app.use("/api/auth", Routes);
app.all("*", notFoundController);
app.use(errorRequestHandler);

export { app };
