import { Subjects } from "#src/events";

export interface ExpirationCompleteEvent {
  subject: Subjects.EXPIRATION_COMPLETE;
  data: {
    donationId: string;
  };
}
