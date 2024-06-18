import { getProfile } from "@/auth/api/profile";
import { useQuery } from "@tanstack/react-query";

export const useProfile = () => {
  return useQuery({
    queryKey: ["auth"],
    queryFn: getProfile,
  });
};
