import { OrderCreatedEvent, Publisher, Subjects } from '@sergway/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
