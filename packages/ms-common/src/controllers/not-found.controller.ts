import { RequestHandler } from "express";

import { NotFoundError } from "#src/errors";

export const notFoundController: RequestHandler = () => {
  throw new NotFoundError();
};
