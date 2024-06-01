import { OrderCanceledEvent, Publisher, Subjects } from '@sergway/common';

export class OrderCanceledPublisher extends Publisher<OrderCanceledEvent> {
  readonly subject = Subjects.OrderCanceled;
}
