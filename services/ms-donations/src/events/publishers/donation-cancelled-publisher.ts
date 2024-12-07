import { DonationCancelledEvent, Publisher, Subjects } from "@devops-premade/ms-common";

export class DonationCancelledPublisher extends Publisher<DonationCancelledEvent> {
  readonly subject = Subjects.DONATION_CANCELLED;
}
