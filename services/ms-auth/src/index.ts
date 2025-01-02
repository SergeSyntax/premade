import { logger } from "@media-premade/ms-common/src/logger";

import { app } from "./app";
import { PORT } from "./config";
import { mongodbClient } from "./mongodb-client";

const handleTerm = async () => {
  await mongodbClient.disconnect();
  process.exit();
};

process.on("SIGTERM", handleTerm);
process.on("SIGINT", handleTerm);

await mongodbClient.connect();

app.listen(PORT, () => logger.info(`Listening on port ${PORT}`));
