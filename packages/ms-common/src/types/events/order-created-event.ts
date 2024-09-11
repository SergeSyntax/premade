import { OrderStatus } from "../../enums";
import { Subjects } from "../../events";

export interface OrderCreatedEvent {
  subject: Subjects.ORDER_CREATED;
  data: {
    id: string;
    version: number;
    status: OrderStatus;
    userId: string;
    expiresAt: Date;
    media: {
      id: string;
      price: number;
    };
  };
}
