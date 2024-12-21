import { PaymentCreatedEvent, Publisher, Subjects } from "@devops-premade/ms-common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PAYMENT_CREATED;
}
