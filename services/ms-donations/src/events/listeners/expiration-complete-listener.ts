import { ExpirationCompleteEvent, Listener, Subjects } from "@media-premade/ms-common";

import { SERVICE_NAME } from "../../config";
import { onExpirationComplete } from "../../services";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  readonly subject = Subjects.EXPIRATION_COMPLETE;
  group = SERVICE_NAME;

  onMessage = onExpirationComplete;
}
