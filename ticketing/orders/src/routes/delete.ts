import { NotAuthorizedError, NotFoundError, OrderStatus, requireAuth } from '@sergway/common';
import express, { Request, Response } from 'express';
import { OrderCanceledPublisher } from '../events/pubishers/order-canceled-publisher';
import { Order } from '../model/order';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.orderId).populate('ticket');

  if (!order) throw new NotFoundError();

  if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError();

  order.status = OrderStatus.Cancelled;
  await order.save();

  // publishing an event saying this was cancelled!
  new OrderCanceledPublisher(natsWrapper.client).publish({
    id: order.id,
    ticket: {
      id: order.ticket.id,
    },
  });
  res.status(204).send(order);
});

export { router as deleteOrderRouter };
