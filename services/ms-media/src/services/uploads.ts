import { ChecksumAlgorithm, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuid } from "uuid";

import { MIO_ACCESS_KEY, MIO_ENDPOINT, MIO_MEDIA_BUCKET, MIO_SECRET_KEY } from "../config";

const s3client = new S3Client({
  region: "IGNORE",
  endpoint: MIO_ENDPOINT,
  credentials: {
    accessKeyId: MIO_ACCESS_KEY,
    secretAccessKey: MIO_SECRET_KEY,
  },
  forcePathStyle: true,
});

export const getUploadUrl = async (fileType: string, checksum: string, userId?: string) => {
  const bucketFileName = uuid();
  const fileExt = fileType.substring(fileType.indexOf("/") + 1);

  const key = `${userId}/${bucketFileName}.${fileExt}`;

  const command = new PutObjectCommand({
    Bucket: MIO_MEDIA_BUCKET,
    Key: key,
    ContentType: "video/mp4",
    ChecksumAlgorithm: ChecksumAlgorithm.SHA256,
    ChecksumSHA256: checksum,
    // ServerSideEncryption: "AES256", you can't use that feature without a vault to manage the keys... https://min.io/docs/minio/linux/administration/server-side-encryption/server-side-encryption-sse-kms.html
  });

  const url = await getSignedUrl(s3client, command, { expiresIn: 36000 });

  return { url, key };
};
