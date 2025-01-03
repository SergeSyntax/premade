import { DonationCreatedEvent, Publisher, Subjects } from "@media-premade/ms-common";

export class DonationCreatedPublisher extends Publisher<DonationCreatedEvent> {
  readonly subject = Subjects.DONATION_CREATED;
}
