import { postLogout } from "../api/logout";
import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";

export const Logout = () => {
  const queryClient = useQueryClient();
  const { navigate } = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await postLogout();
      } catch (error) {
        console.error(error);
      } finally {
        await queryClient.invalidateQueries();
        navigate({
          to: "/",
        });
      }
    };

    handleLogout();
  }, [navigate, queryClient]);

  return <div>Signing out..</div>;
};
