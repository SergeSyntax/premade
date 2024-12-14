import {
  ConsumeMessage,
  DonationCancelledEvent,
  Listener,
  Subjects,
} from "@devops-premade/ms-common";

import { SERVICE_NAME } from "../../config";
import { onDonationCancelledService } from "../../services/donations";
import { MediaUpdatedPublisher } from "../publishers";

export class DonationCancelledListener extends Listener<DonationCancelledEvent> {
  readonly subject = Subjects.DONATION_CANCELLED;
  group = SERVICE_NAME;
  async onMessage(data: DonationCancelledEvent["data"], msg: ConsumeMessage): Promise<void> {
    const media = await onDonationCancelledService(data, msg);
    
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
