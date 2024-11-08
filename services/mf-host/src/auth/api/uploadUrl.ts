import { mediaService } from "./mediaService";

interface UploadResponse {
  url: string;
  key: string;
}

export const getUploadUrl = (fileType: string) =>
  mediaService.get<UploadResponse>("/uploads", {
    params: {
      fileType,
    },
  });
