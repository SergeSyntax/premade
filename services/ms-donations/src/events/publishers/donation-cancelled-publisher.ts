import { DonationCancelledEvent, Publisher, Subjects } from "@media-premade/ms-common";

export class DonationCancelledPublisher extends Publisher<DonationCancelledEvent> {
  readonly subject = Subjects.DONATION_CANCELLED;
}
