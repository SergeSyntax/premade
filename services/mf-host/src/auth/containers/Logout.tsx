import { postLogout } from "../api/logout";
import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";

export const Logout = () => {
  const { removeQueries } = useQueryClient();
  const { navigate } = useRouter();
  useEffect(() => {
    postLogout()
      .catch(console.error)
      .finally(() => {
        removeQueries();
        navigate({
          to: "/",
        });
      });
  }, [navigate, removeQueries]);
  return <div>Signing out..</div>;
};
