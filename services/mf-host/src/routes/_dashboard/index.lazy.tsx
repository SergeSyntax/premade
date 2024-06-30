import { MediaContent } from "@/media/containers";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_dashboard/")({
  component: MediaContent,
});
