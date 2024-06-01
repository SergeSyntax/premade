import mongoose from 'mongoose';

import { app } from './app';
import { OrderCanceledListener } from './events/listeners/order-canceled-listener';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
  if (!process.env.JWT_KEY) throw new Error('JWT_KEY must be defined');

  if (!process.env.MONGO_URI) throw new Error('MONGO_URI must be defined');

  if (!process.env.NATS_CLIENT_ID) throw new Error('NATS_CLIENT_ID must be defined');
  if (!process.env.NATS_URL) throw new Error('NATS_URL must be defined');
  if (!process.env.NATS_CLUSTER_ID) throw new Error('NATS_CLUSTER_ID must be defined');

  try {
    /**
     * NATS Connection
     */
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    const stan = natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit(1);
    });
    process.on('SIGINT', () => stan.close());
    process.on('SIGTERM', () => stan.close());
    process.on('SIGUSR2', () => stan.close());

    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCanceledListener(natsWrapper.client).listen();

    /**
     * Mongoose connection
     */
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!!!!!!!!');
  });
};

start();
