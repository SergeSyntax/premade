import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from '@assign-management/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { Order } from '../model/order';
import { Ticket } from '../model/ticket';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  '/api/orders',
  requireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      // Service coupling (bad practice to assume the service structure)
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('TicketId must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    // Find the ticket the user is trying to order in the database
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw new NotFoundError();
    // Make sure this ticket is not already reserved
    const existingOrder = await ticket.isReserved();
    if (existingOrder) throw new BadRequestError('Ticket is already reserved.');
    // Calculate an expiration date for this order
    const expiriesAt = new Date();
    expiriesAt.setSeconds(expiriesAt.getSeconds() + EXPIRATION_WINDOW_SECONDS);
    // Build the order and save it to the database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiriesAt,
      ticket,
    });
    await order.save();
    // Publish an event saying that an order was created
    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
