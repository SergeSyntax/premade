import { Listener, MediaUpdatedEvent, Subjects } from "@media-premade/ms-common";

import { SERVICE_NAME } from "../../config";
import { onMediaUpdatedService } from "../../services/media";

export class MediaUpdatedListener extends Listener<MediaUpdatedEvent> {
  readonly subject = Subjects.MEDIA_UPDATED;
  group = SERVICE_NAME;

  onMessage = onMediaUpdatedService;
}
