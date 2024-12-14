import { Subjects } from "../../events";

export interface ExpirationCompleteEvent {
  subject: Subjects.EXPIRATION_COMPLETE;
  data: {
    donationId: string;
  };
}
