import { useQuery } from "@tanstack/react-query";
import { getMediaList } from "../api";

export const useMediaList = () => {
  return useQuery({
    queryKey: ["mediaRecords"],
    queryFn: getMediaList,
  });
};
