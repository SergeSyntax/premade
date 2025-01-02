import { useQuery } from "@tanstack/react-query";
import { getDonation } from "../api/donations";

export const useGetDonation = (donationId: string) => {
  return useQuery({
    queryKey: ["donations", donationId],
    queryFn: () => getDonation(donationId),
  });
};
