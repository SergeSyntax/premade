import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuid } from "uuid";

import { MIO_ACCESS_KEY, MIO_BUCKET, MIO_ENDPOINT, MIO_SECRET_KEY } from "../config";

const s3client = new S3Client({
  region: "IGNORE",
  endpoint: MIO_ENDPOINT,
  credentials: {
    accessKeyId: MIO_ACCESS_KEY,
    secretAccessKey: MIO_SECRET_KEY,
  },
  forcePathStyle: true,
});

export const getUploadUrl = async (fileType: string, userId?: string) => {
  const bucketFileName = uuid();
  const fileExt = fileType.substring(fileType.indexOf("/" + 1));

  const key = `${userId}/${bucketFileName}.${fileExt}`;

  const command = new PutObjectCommand({
    Bucket: MIO_BUCKET,
    Key: key,
    ContentType: "video/mp4",
    ServerSideEncryption: "AES256",
  });

  const url = await getSignedUrl(s3client, command, { expiresIn: 36000 });

  return { url, key };
};
