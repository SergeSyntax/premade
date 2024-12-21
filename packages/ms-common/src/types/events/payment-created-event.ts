import { Subjects } from "../../events";

export interface PaymentCreatedEvent {
  subject: Subjects.PAYMENT_CREATED;
  data: {
    id: string;
    donationId: string;
    stripeId: string;
  };
}
