import { Subjects } from "../../events";

export interface OrderCancelledEvent {
  subject: Subjects.ORDER_CANCELLED;
  data: {
    id: string;
    version: number;
    media: {
      id: string;
    };
  };
}
