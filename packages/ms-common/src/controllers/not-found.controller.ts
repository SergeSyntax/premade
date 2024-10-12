import { RequestHandler } from "express";

import { NotFoundError } from "../errors";

export const notFoundController: RequestHandler = () => {
  throw new NotFoundError();
};
