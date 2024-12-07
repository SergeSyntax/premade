import { Currency, PaymentModels, Visibility } from "../../enums";
import { Subjects } from "../../events/subjects";

export interface MediaCreatedEvent {
  subject: Subjects.MEDIA_CREATED;
  data: {
    id: string;
    title: string;
    price: number;
    currency: Currency;
    paymentModel: PaymentModels;
    visibility: Visibility;
    scheduledDate?: string;
  };
}
