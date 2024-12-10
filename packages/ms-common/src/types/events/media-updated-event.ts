import { Currency, PaymentModels, Visibility } from "../../enums";
import { Subjects } from "../../events/subjects";

export interface MediaUpdatedEvent {
  subject: Subjects.MEDIA_UPDATED;
  data: {
    id: string;
    title: string;
    price: number;
    currency: Currency;
    paymentModel: PaymentModels;
    visibility: Visibility;
    scheduledDate?: string;
    userId: string;
    version: number;
  };
}
