import { Publisher, Subjects, TicketCreatedEvent } from '@sergway/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
