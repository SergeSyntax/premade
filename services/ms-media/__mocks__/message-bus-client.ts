import { jest } from "@jest/globals";

export const messageBusClient = {
  channelWrapper: {
    addSetup: jest.fn().mockImplementation(() => Promise.resolve<void>(undefined)),
    publish: jest.fn(),
    ack: jest.fn(), // Mock for acknowledging messages
    nack: jest.fn(), // Mock for negatively acknowledging messages
  },
};
