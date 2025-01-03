import {
  ChecksumAlgorithm,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  S3ClientConfig,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export class StorageClient {
  public client: S3Client;

  constructor(endpoint: string, credentials: S3ClientConfig["credentials"], region = "IGNORE") {
    this.client = new S3Client({
      region,
      endpoint,
      credentials,
      forcePathStyle: true,
    });
  }

  signPutObjectSignedUrl(
    bucket: string,
    contentType: string,
    key: string,
    checksum: string,
    expiresIn?: number,
  ) {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
      ChecksumAlgorithm: ChecksumAlgorithm.SHA256,
      ChecksumSHA256: checksum,
      // ServerSideEncryption: "AES256", you can't use that feature without a vault to manage the keys... https://min.io/docs/minio/linux/administration/server-side-encryption/server-side-encryption-sse-kms.html
    });
    return getSignedUrl(this.client, command, { expiresIn });
  }

  async signGetObjectCommand(
    bucket: string,
    key: string,
    expiresIn: number,
    cacheControl = "no-store",
  ) {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
      ResponseCacheControl: cacheControl,
      ResponseContentType: "application/octet-stream",
    });

    return await getSignedUrl(this.client, command, { expiresIn });
  }
}
