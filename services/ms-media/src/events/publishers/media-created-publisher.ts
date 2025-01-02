import { MediaCreatedEvent, Publisher, Subjects } from "@media-premade/ms-common";

export class MediaCreatedPublisher extends Publisher<MediaCreatedEvent> {
  readonly subject = Subjects.MEDIA_CREATED;
}
