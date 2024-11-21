import { OrderCreatedEvent, Publisher, Subjects } from "@devops-premade/ms-common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.ORDER_CREATED;
}
