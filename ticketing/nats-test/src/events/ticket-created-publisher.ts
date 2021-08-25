import { Publisher } from './base-publisher';
import { Subjects } from './subjects';
import { TicketedCreatedEvent } from './ticket-created-event';

export class TicketCreatedPublisher extends Publisher<TicketedCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
