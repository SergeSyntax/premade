import { useMutation } from "@tanstack/react-query";
import { createDonation } from "../api/donations";
import { useRouter } from "@tanstack/react-router";

export const useCreateDonation = (mediaId: string) => {
  const router = useRouter();

  return useMutation({
    mutationFn: () => createDonation({ mediaId }),
    onSuccess: (order) => {
      console.log(order);
      router.navigate({
        to: `/donations/${order.data.donation.id}`,
      });
    },
  });
};
