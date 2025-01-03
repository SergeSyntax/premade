import { StorageClient } from "@media-premade/ms-common";

import { MIO_ACCESS_KEY, MIO_ENDPOINT, MIO_SECRET_KEY } from "./config";

const credentials = {
  accessKeyId: MIO_ACCESS_KEY,
  secretAccessKey: MIO_SECRET_KEY,
};

export const storageClient = new StorageClient(MIO_ENDPOINT, credentials);
