import { PaymentCreatedEvent, Publisher, Subjects } from "@media-premade/ms-common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PAYMENT_CREATED;
}
