import { NotFoundError } from "@devops-premade/ms-common";
import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

import {
  createOrderService,
  deleteOrderService,
  getOrderResourceListService,
  getOrderResourceService,
} from "../services/orders";

export const createOrderController: RequestHandler = async (req, res) => {
  const order = await createOrderService(req.body, req.currentUser!.id);
  res.status(StatusCodes.CREATED).send({ order });
};

export const deleteOrderController: RequestHandler = async (req, res) => {
  const order = await deleteOrderService(req.params.orderId, req.currentUser!.id);
  res.status(StatusCodes.OK).send(order);
};

export const getOrderResourceController: RequestHandler = async (req, res) => {
  const order = await getOrderResourceService(req.params.orderId as string);

  if (!order) {
    throw new NotFoundError();
  }

  res.status(StatusCodes.OK).send({ order });
};

export const getOrderResourceListController: RequestHandler = async (req, res) => {
  const orders = await getOrderResourceListService();

  res.status(StatusCodes.OK).send({ orders });
};
