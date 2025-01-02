import { ExpirationCompleteEvent, Publisher, Subjects } from "@media-premade/ms-common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.EXPIRATION_COMPLETE;
}
