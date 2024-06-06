import "express-async-errors";
import express, { RequestHandler } from "express";
import { Env } from "@premade/ms-common";
import { NotFoundError } from "./lib/http-error";
import { Routes } from "./routes";
import { httpLogMiddleware } from "./utils";
import cookieSession from "cookie-session";
import { errorRequestHandler } from "./routes/error-response-handler";
import { NODE_ENV } from "./config";

const notFoundController: RequestHandler = () => {
  throw new NotFoundError();
};

const app = express();
// traffic proxy through istio-ingress
// express don't trust to ssl on proxy by default
app.set("trust proxy", true);
app.use(express.json({ limit: "100kb" }));
// change secure to use ssl
app.use(cookieSession({ signed: false, secure: NODE_ENV === Env.Production }));
app.use(httpLogMiddleware);
app.use("/api/auth", Routes);
app.all("*", notFoundController);
app.use(errorRequestHandler);

export { app };
