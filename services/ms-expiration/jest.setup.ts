import {  jest } from "@jest/globals";

import { messageBusClient } from "./__mocks__/message-bus-client";

jest.unstable_mockModule("./src/message-bus-client", () => ({
  messageBusClient: messageBusClient,
}));

