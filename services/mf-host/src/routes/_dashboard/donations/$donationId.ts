import DonationShow from "@/donations/containers/DonationShow";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/donations/$donationId")({
  component: DonationShow,
});
