import { PaymentCreatedEvent, Publisher, Subjects } from '@sergway/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
