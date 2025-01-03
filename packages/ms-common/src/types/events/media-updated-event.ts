import { Currency, PaymentModels, Visibility } from "#src/enums";
import { Subjects } from "#src/events";

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
    donationInProgress: boolean;
    userId: string;
    version: number;
  };
}
