import MediaWatch from "@/media/containers/MediaWatch";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/watch/$mediaId")({
  component: MediaWatch,
});
