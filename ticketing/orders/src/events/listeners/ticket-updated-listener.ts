import { Listener, Subjects, TicketUpdatedEvent } from '@sergway/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../model/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message): Promise<void> {
    const { title, price, id } = data;
    const ticket = Ticket.build({
      title,
      price,
    });
    await ticket.save();
    msg.ack();
  }
}
