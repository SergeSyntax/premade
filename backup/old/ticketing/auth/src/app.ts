import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler, NotFoundError } from '@sergway/common';

const app = express();
// traffic proxy through nginx-ingress
// express don't trust to ssl on proxy by default
app.set('trust proxy', true);
app.use(express.json());
app.use(
  cookieSession({
    // jwt is already encrypted and can't be tempered
    signed: false,
    // check that the user use https connection
    secure: false,
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
