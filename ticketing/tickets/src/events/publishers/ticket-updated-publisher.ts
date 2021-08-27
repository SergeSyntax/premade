import { Publisher, Subjects, TicketedUpdatedEvent } from '@assign-management/common';

export class TicketUpdatedPublisher extends Publisher<TicketedUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
