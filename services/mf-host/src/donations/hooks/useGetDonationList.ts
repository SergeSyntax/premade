import { useQuery } from "@tanstack/react-query";
import { getDonationList } from "../api/donations";

export const useGetDonationList = () => {
  return useQuery({
    queryKey: ["donations"],
    queryFn: getDonationList,
  });
};
