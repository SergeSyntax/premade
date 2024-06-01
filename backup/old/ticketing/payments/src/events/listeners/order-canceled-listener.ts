import { Listener, OrderCanceledEvent, OrderStatus, Subjects } from '@sergway/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../model/order';
import { queueGroupName } from './queue-group-name';

export class OrderCanceledListener extends Listener<OrderCanceledEvent> {
  readonly subject = Subjects.OrderCanceled;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCanceledEvent['data'], msg: Message): Promise<void> {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    if (!order) throw new Error('ORder not found');

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    msg.ack();
  }
}
