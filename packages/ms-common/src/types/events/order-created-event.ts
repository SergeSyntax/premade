import { DonationStatus } from "../../enums";
import { Subjects } from "../../events";

export interface DonationCreatedEvent {
  subject: Subjects.DONATION_CREATED;
  data: {
    id: string;
    version: number;
    status: DonationStatus;
    userId: string;
    expiresAt: Date;
    media: {
      id: string;
      price: number;
    };
  };
}
