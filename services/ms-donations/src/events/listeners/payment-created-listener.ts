import {
  Listener,
  PaymentCreatedEvent,
  Subjects,
} from "@devops-premade/ms-common";

import { SERVICE_NAME } from "../../config";
import { onPaymentCreatedService } from "../../services";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PAYMENT_CREATED;
  group = SERVICE_NAME;

  async onMessage(data: PaymentCreatedEvent["data"]) {
    await onPaymentCreatedService(data.id);
  }
}
