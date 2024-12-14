import { ExpirationCompleteEvent, Publisher, Subjects } from "@devops-premade/ms-common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.EXPIRATION_COMPLETE;
}
