import { Publisher, Subjects, TicketedUpdatedEvent } from '@sergway/common';

export class TicketUpdatedPublisher extends Publisher<TicketedUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
