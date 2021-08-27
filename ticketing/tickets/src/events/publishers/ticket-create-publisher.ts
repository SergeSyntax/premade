import { Publisher, Subjects, TicketedCreatedEvent } from '@assign-management/common';

export class TicketCreatedPublisher extends Publisher<TicketedCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
