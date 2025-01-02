import axios from "axios";
import { mediaService } from "../../common/api/mediaService";
import { useQuery } from "@tanstack/react-query";
import { SignUrlArgs } from "@/types";

interface UploadResponse {
  url: string;
  key: string;
}

export const getVideoUploadUrl = async ({ checksum, type }: SignUrlArgs) =>
  mediaService.get<UploadResponse>("/uploads/video", {
    params: {
      fileType: type,
      checksum,
    },
  });
export const getThumbnailUploadUrl = ({ checksum, type }: SignUrlArgs) =>
  mediaService.get<UploadResponse>("/uploads/thumbnail", {
    params: {
      fileType: type,
      checksum,
    },
  });

export const useGetUploadUrl = (fileType: string) => {
  const { refetch, data, error, isLoading } = useQuery({
    enabled: false,
    queryKey: ["uploadUrl", fileType],
  });

  return {
    fetch: refetch,
    data,
    error,
    isLoading,
  };
};

export const uploadPresignedURLFile = async (
  url: string,
  file: File,
  { checksum, type }: SignUrlArgs,
) => {
  await axios.put(url, file, {
    headers: {
      "Content-Type": type,
      "x-amz-checksum-sha256": checksum,
      // "x-amz-server-side-encryption": "AES256", // Include this header
    },
  });
};
