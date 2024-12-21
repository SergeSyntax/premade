import {
  ConsumeMessage,
  DonationCancelledEvent,
  Listener,
  Subjects,
} from "@devops-premade/ms-common";

import { SERVICE_NAME } from "../../config";
import { onDonationCancelledService } from "../../services/donations";

export class DonationCancelledListener extends Listener<DonationCancelledEvent> {
  readonly subject = Subjects.DONATION_CANCELLED;
  group = SERVICE_NAME;
  async onMessage(data: DonationCancelledEvent["data"]): Promise<void> {
    await onDonationCancelledService(data);
  }
}
