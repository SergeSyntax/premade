import { jest } from "@jest/globals";

export const stripe = {
  charges: {
    create: jest.fn<(...args: unknown[]) => Promise<unknown>>().mockResolvedValue({}),
  },
};
