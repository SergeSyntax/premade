import { Message } from 'node-nats-streaming';
import { Listener } from './base-listener';
import { Subjects } from './subjects';
import { TicketedCreatedEvent } from './ticket-created-event';

export class TicketCreatedListener extends Listener<TicketedCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = 'payments-service';
  onMessage(data: TicketedCreatedEvent['data'], msg: Message): void {
    console.log('Event data!', data);
    msg.ack();
  }
}
