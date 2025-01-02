import { MessageBusClient } from "@media-premade/ms-common";

import { POD_NAME, RMQ_HOST, RMQ_PASSWORD, RMQ_PORT, RMQ_PROTOCOL, RMQ_USERNAME } from "./config";

export const messageBusClient = new MessageBusClient({
  hostsEnv: RMQ_HOST,
  portsEnv: RMQ_PORT,
  connectionName: POD_NAME,
  connectOptions: {
    username: RMQ_USERNAME,
    password: RMQ_PASSWORD,
    protocol: RMQ_PROTOCOL,
  },
});
