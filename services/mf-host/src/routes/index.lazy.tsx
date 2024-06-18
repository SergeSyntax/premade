import { Dashboard } from "@/dashboard/containers/Dashboard";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: Dashboard,
});
