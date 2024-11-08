import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Request, Response } from "express";

import { createHTTPLogMiddleware } from "../../src/logger/morgan";
import { CustomLogger } from "../../src/logger/types";
import { createWinstonLogger } from "../../src/logger/winston";

describe("createHTTPLogMiddleware", () => {
  let logger: CustomLogger;
  const req = {
    headers: {},
  } as Request;
  const res = {} as Response;
  const next = jest.fn();

  beforeEach(() => {
    logger = {
      http: jest.fn(),
    } as any;
    next.mockClear();
  });

  it("should not throw an error when invoked with default arguments", () => {
    expect(() => {
      createHTTPLogMiddleware(logger, false);
    }).not.toThrow();
  });

  it("should return a no-op middleware when disableMorgan is true", () => {
    const middleware = createHTTPLogMiddleware(logger, true);

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it("should return a morgan middleware when disableMorgan is false", () => {
    const middleware = createHTTPLogMiddleware(logger, false);

    expect(() => {
      middleware(req, res, next);
    }).not.toThrow();
  });
});

describe("createWinstonLogger", () => {
  it("should not throw an error when invoked with default arguments", () => {
    expect(() => {
      createWinstonLogger({});
    }).not.toThrow();
  });
});
