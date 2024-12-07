import { ValidationError } from "@devops-premade/ms-common";
import mime from "mime";
import { v4 as uuid } from "uuid";

import { MIO_MEDIA_BUCKET, MIO_THUMBNAIL_BUCKET } from "../config";
import { storageClient } from "../storage-client";
import { UploadRequestQuery, UploadResponse } from "../types/uploads";

const HOUR = 3600; // seconds
const IMAGE_EXPIRE_IN = 1 * HOUR; // 1 hour
const VIDEO_EXPIRE_IN = 12 * HOUR; // 12 hours in seconds

const validateContentType = (typePrefix: "video" | "image", contentType: string | null) => {
  if (!contentType || !contentType.includes(typePrefix)) {
    throw new ValidationError(
      "fileType",
      `Invalid fileType. Only ${typePrefix} MIME types are allowed.`,
    );
  }

  return contentType;
};

const parseFileExt = (fileType: string) => {
  const fileTypeParts = fileType.split("/");
  return fileTypeParts[fileTypeParts.length - 1];
};

export const getVideoUploadUrl = async (
  { checksum, fileType }: UploadRequestQuery,
  userId?: string,
): Promise<UploadResponse> => {
  const fileExt = parseFileExt(fileType);
  const contentType = validateContentType("video", mime.getType(fileExt));

  const key = `${userId}/${uuid()}.${fileExt}`;

  const url = await storageClient.getPutObjectSignedUrl(
    MIO_MEDIA_BUCKET,
    contentType,
    key,
    checksum,
    VIDEO_EXPIRE_IN,
  );

  return { url, key };
};

export const getThumbnailUploadUrl = async (
  { checksum, fileType }: UploadRequestQuery,
  userId?: string,
): Promise<UploadResponse> => {
  const fileExt = parseFileExt(fileType);

  const contentType = validateContentType("image", mime.getType(fileExt));
  const key = `${userId}/${uuid()}.${fileExt}`;

  const url = await storageClient.getPutObjectSignedUrl(
    MIO_THUMBNAIL_BUCKET,
    contentType,
    key,
    checksum,
    IMAGE_EXPIRE_IN,
  );

  return { url, key };
};
