import { ConsumeMessage, DonationCreatedEvent, Listener, Subjects } from "@media-premade/ms-common";

import { SERVICE_NAME } from "../../config";
import { expirationQueue } from "../../queues/expieration-queue";

export class DonationCreatedListener extends Listener<DonationCreatedEvent> {
  readonly subject = Subjects.DONATION_CREATED;
  group = SERVICE_NAME;
  async onMessage(data: DonationCreatedEvent["data"], _msg: ConsumeMessage): Promise<void> {
    // TODO: extract to service add logger on scheduling consider cron for interval approach
    const delay = new Date(data.expiresAt).getTime() - Date.now();
    await expirationQueue.add(
      data.id,
      {
        donationId: data.id,
      },
      {
        delay,
      },
    );
  }
}
