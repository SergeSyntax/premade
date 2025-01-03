import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { postRegister } from "../api/register";

export const useRegister = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: postRegister,
    onSuccess: ({ data }) => {
      queryClient.setQueryData(["auth"], data.user);
      router.navigate({
        to: "/",
      });
    },
  });
};
