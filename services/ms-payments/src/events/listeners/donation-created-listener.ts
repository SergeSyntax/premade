import {
  DonationCreatedEvent,
  Listener,
  Subjects,
} from "@devops-premade/ms-common";

import { SERVICE_NAME } from "../../config";
import { onDonationCreatedService } from "../../services/donations";

export class DonationCreatedListener extends Listener<DonationCreatedEvent> {
  readonly subject = Subjects.DONATION_CREATED;
  group = SERVICE_NAME;
  async onMessage(data: DonationCreatedEvent["data"]): Promise<void> {
    await onDonationCreatedService(data);
  }
}
