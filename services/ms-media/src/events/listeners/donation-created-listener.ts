import {
  ConsumeMessage,
  DonationCreatedEvent,
  DonationStatus,
  Listener,
  Subjects,
} from "@devops-premade/ms-common";

import { SERVICE_NAME } from "../../config";
import { onDonationCreatedService } from "../../services/donations";
import { MediaUpdatedPublisher } from "../publishers";

export class DonationCreatedListener extends Listener<DonationCreatedEvent> {
  readonly subject = Subjects.DONATION_CREATED;
  group = SERVICE_NAME;
  async onMessage(data: DonationCreatedEvent["data"], msg: ConsumeMessage): Promise<void> {
    const media = await onDonationCreatedService(data, msg);
    
    await new MediaUpdatedPublisher(this.client).publish({
      id: media.id,
      title: media.title,
      price: media.price,
      currency: media.currency!,
      paymentModel: media.paymentModel!,
      visibility: media.visibility!,
      scheduledDate: media.scheduledDate?.toISOString(),
      donationInProgress: media.donationInProgress,
      version: media.version,
      userId: data.userId,
    });
  }
}
