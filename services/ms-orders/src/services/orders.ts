import { NotAuthorizedError, NotFoundError, OrderStatus } from "@devops-premade/ms-common";

import { OrderCancelledPublisher, OrderCreatedPublisher } from "../events/publishers";
import { messageBusClient } from "../message-bus-client";
import { Media, Order } from "../models";
import { OrderReqBody } from "../types";

const EXPIRATION_WINDOW_SECONDS = 1 * 60;

export const getOrderResourceListService = async () => {
  const orders = await Order.find();

  return orders;
};

export const createOrderService = async (body: OrderReqBody, userId: string) => {
  // check if the media exists
  const media = await Media.findById(body.mediaId);
  if (!media) throw new NotFoundError();

  const expiresAt = new Date();
  expiresAt.setSeconds(expiresAt.getSeconds() + EXPIRATION_WINDOW_SECONDS);

  const order = new Order({ expiresAt, userId, media, status: OrderStatus.CREATED });
  await order.save();

  await new OrderCreatedPublisher(messageBusClient.channelWrapper).publish({
    id: order.id,
    version: order.version,
    status: order.status,
    userId: order.userId,
    expiresAt: order.expiresAt,
    media: {
      id: media.id,
      price: media.price,
    },
  });

  return order;
};

export const getOrderResourceService = async (orderId: string) => {
  const order = await Order.findById(orderId).populate("media");

  if (!order) throw new NotFoundError();

  return order;
};

export const deleteOrderService = async (orderId: string, userId: string) => {
  const order = await getOrderResourceService(orderId);

  if (order.userId !== userId) throw new NotAuthorizedError();

  order.status = OrderStatus.CANCELLED;
  await order.save();

  new OrderCancelledPublisher(messageBusClient.channelWrapper).publish({
    id: order.id,
    media: {
      id: order.media.id,
    },
    version: order.version,
  });

  return order;
};
