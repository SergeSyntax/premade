import { Subjects } from "../../events";

export interface DonationCancelledEvent {
  subject: Subjects.DONATION_CANCELLED;
  data: {
    id: string;
    version: number;
    userId: string;
    media: {
      id: string;
    };
  };
}
