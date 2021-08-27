import { OrderCreatedEvent, Publisher, Subjects } from '@assign-management/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
