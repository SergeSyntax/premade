import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../model/ticket';

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });

  await ticket.save();

  return ticket;
};

it('fetches orders for an particular user', async () => {
  // Create three tickets
  const ticketOne = await buildTicket();
  const ticketTwo = await buildTicket();
  const ticketThree = await buildTicket();
  // Create one orders as User #1
  const userOne = global.signin();
  const userTwo = global.signin();
  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  // Create two orders as User #2
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketTwo.id })
    .expect(201);

  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketThree.id })
    .expect(201);
  // Make request to get order for User #2
  const response = await request(app).get('/api/orders').set('Cookie', userTwo).expect(200);
  // Make sure we only got the order for User #2
  expect(response.body).toHaveLength(2);
  expect(response.body).toEqual(
    expect.arrayContaining([expect.objectContaining(orderOne), expect.objectContaining(orderTwo)])
  );
  // expect(response.body).arr(orderTwo);
});
