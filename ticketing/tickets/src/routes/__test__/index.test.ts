import request from 'supertest';
import { app } from '../../app';

const createTicket = () =>
  request(app).post('/api/tickets').set('Cookie', global.signin()).send({
    title: 'random',
    price: 20,
  });

it('can fetch a list of tickets', async () => {
  const length = 3;
  for (let i = 0; i < length; i++) await createTicket();

  const response = await request(app).get('/api/tickets').send().expect(200);

  expect(response.body.length).toEqual(length);
});
