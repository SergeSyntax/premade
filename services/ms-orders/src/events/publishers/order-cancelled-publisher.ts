import { OrderCancelledEvent, Publisher, Subjects } from "@devops-premade/ms-common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.ORDER_CANCELLED;
}
