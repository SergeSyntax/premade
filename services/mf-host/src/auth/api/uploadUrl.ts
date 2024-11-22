import { mediaService } from "./mediaService";
import { useQuery } from "@tanstack/react-query";

interface UploadResponse {
  url: string;
  key: string;
}

export const getUploadUrl = (fileType: string, checksum: string) =>
  mediaService.get<UploadResponse>("/uploads", {
    params: {
      fileType,
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
