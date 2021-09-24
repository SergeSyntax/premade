import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from '@sergway/common';
import { Message } from 'node-nats-streaming';
import { expirationQueue } from '../../queues/expiration-queue';
import { queueGroupName } from './queue-group-name';

const SEC = 1000;
const MINUTE = SEC * 60;

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - Date.now();
    console.log('Waiting this many militseconds to process the job:', delay);

    await expirationQueue.add({ orderId: data.id }, { delay });
    msg.ack();
  }
}
