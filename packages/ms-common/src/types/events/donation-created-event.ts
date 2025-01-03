import { Currency, DonationStatus } from "#src/enums";
import { Subjects } from "#src/events";

export interface DonationCreatedEvent {
  subject: Subjects.DONATION_CREATED;
  data: {
    id: string;
    version: number;
    status: DonationStatus;
    userId: string;
    expiresAt: string;
    media: {
      id: string;
      price: number;
      currency: Currency;
    };
  };
}
