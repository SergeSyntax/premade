import { Logout } from "@/auth/containers/Logout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/logout")({
  component: Logout,
});
