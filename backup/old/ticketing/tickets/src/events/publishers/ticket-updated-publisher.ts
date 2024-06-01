import { Publisher, Subjects, TicketUpdatedEvent } from '@sergway/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
