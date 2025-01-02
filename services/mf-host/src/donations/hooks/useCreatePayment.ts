import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { createPayment } from "../api/payments";

export const useCreatePayment = (donationId: string) => {
  const router = useRouter();

  return useMutation({
    mutationFn: (token: string) => createPayment(donationId, token),
    onSuccess: () => {
      router.navigate({
        to: `/donations`,
      });
    },
  });
};
