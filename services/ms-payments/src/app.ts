import "express-async-errors";

import dotenv from "dotenv";

dotenv.config({
  // services/auth/.env
  path: ".env",
});

import { errorRequestHandler, NotFoundError } from "@devops-premade/ms-common";
import { Env } from "@devops-premade/ms-common";
import { httpLogMiddleware } from "@devops-premade/ms-common/src/logger";
import cookieSession from "cookie-session";
import cors from "cors";
import express, { RequestHandler } from "express";

import * as env from "./config/env";
import { routes } from "./routes";

const notFoundController: RequestHandler = () => {
  throw new NotFoundError();
};

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
app.use(cookieSession({ signed: false, secure: env.NODE_ENV === Env.Production }));
app.use(httpLogMiddleware);
app.use("/api/payments", routes);
app.all("*", notFoundController);
app.use(errorRequestHandler);

export { app };
