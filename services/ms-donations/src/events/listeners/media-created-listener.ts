import { Listener, MediaCreatedEvent, Subjects } from "@media-premade/ms-common";

import { SERVICE_NAME } from "../../config";
import { onMediaCreatedService } from "../../services/media";


export class MediaCreatedListener extends Listener<MediaCreatedEvent> {
  readonly subject = Subjects.MEDIA_CREATED;
  group = SERVICE_NAME;

  onMessage = onMediaCreatedService;
}
