import { OrderCanceledEvent, Publisher, Subjects } from '@assign-management/common';

export class OrderCanceledPublisher extends Publisher<OrderCanceledEvent> {
  readonly subject = Subjects.OrderCanceled;
}
