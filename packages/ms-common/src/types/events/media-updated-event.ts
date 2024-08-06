import { Subjects } from "../../events/subjects";

export interface MediaUpdatedEvent {
  subject: Subjects.MEDIA_CREATED;
  data: {
    id: string;
  };
}
