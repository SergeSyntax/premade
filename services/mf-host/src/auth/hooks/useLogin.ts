import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLogin } from "../api/login";
import { useRouter } from "@tanstack/react-router";

export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: postLogin,
    onSuccess: ({ data }) => {
      queryClient.setQueryData(["auth"], data.user);
      router.navigate({
        to: "/",
      });
    },
  });
};
