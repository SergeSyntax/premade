import { Subjects } from "#src/events/subjects";

export interface EventStructure {
  subject: Subjects;
  data: unknown;
}
