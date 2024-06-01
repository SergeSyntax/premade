import { Listener, OrderStatus, PaymentCreatedEvent, Subjects } from '@sergway/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { queueGroupName } from './queue-group-name';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  queueGroupName = queueGroupName;
  async onMessage(data: PaymentCreatedEvent['data'], msg: Message): Promise<void> {
    const order = await Order.findById(data.orderId);

    if (!order) throw new Error('Order not found');

    order.set({
      status: OrderStatus.Complete,
    });

    await order.save();

    msg.ack();
  }
  readonly subject = Subjects.PaymentCreated;
}
