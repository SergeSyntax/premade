import { Currency, PaymentModels, Visibility } from "#src/enums";
import { Subjects } from "#src/events";

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
    userId: string;
    version: number;
  };
}
