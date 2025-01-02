import { useQuery } from "@tanstack/react-query";
import { getMediaItem } from "../api";

export const useMediaItem = (mediaId: string) => {
  return useQuery({
    queryKey: ["mediaRecords", mediaId],
    queryFn: () => getMediaItem(mediaId),
    staleTime: 600000, // Data will not refetch for 10 minutes (in milliseconds)
    refetchOnWindowFocus: false, // Prevent refetching on window focus
    refetchOnMount: false, // Prevent refetching on remount
  });
};
