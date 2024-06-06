import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { loginService, registerService } from "../services/auth";

const loginController: RequestHandler = async (req, res) => {
  const user = await loginService(req.body);
  const userJWT = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);

  req.session = { jwt: userJWT };
  res.status(StatusCodes.CREATED).send({ user });
};

const registerController: RequestHandler = async (req, res) => {
  const user = await registerService(req.body);
  const userJWT = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);

  req.session = { jwt: userJWT };
  res.status(StatusCodes.CREATED).send({ user });
};

const currentUserController: RequestHandler = (req, res) => {
  res.send({ user: req.currentUser ?? null });
};

const logoutController: RequestHandler = (req, res) => {
  req.session = null;

  res.send({});
};

export { loginController, registerController, currentUserController, logoutController };
