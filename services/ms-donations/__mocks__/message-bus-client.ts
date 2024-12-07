import { jest } from "@jest/globals";

export const messageBusClient = {
  channelWrapper: {
    addSetup: jest.fn().mockImplementation(() => Promise.resolve<void>(undefined)),
    publish: jest.fn(),
  },
};
