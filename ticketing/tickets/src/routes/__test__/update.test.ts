import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({ title: 'random', price: 20 })
    .expect(404);
});
it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).put(`/api/tickets/${id}`).send({ title: 'random', price: 20 }).expect(401);
});
it('returns a 401 if the user does not own the ticket', async () => {
  const response = await request(app).post('/api/tickets').set('Cookie', global.signin()).send({
    price: 20,
    title: 'random',
  });

  console.log(response.body.id);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'new random title',
      price: 100,
    })
    .expect(401);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
  const cookie = global.signin();
  const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({
    price: 20,
    title: 'random',
  });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 100,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new random title',
      price: -100,
    })
    .expect(400);
});
it('updates the ticket proved valid inputs', async () => {
  const updatedTitle = 'new random title';
  const updatedPrice = 100;
  const cookie = global.signin();
  const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({
    price: 20,
    title: 'random',
  });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: updatedTitle,
      price: updatedPrice,
    })
    .expect(200);

  const ticketResponse = await request(app).get(`/api/tickets/${response.body.id}`).send();

  expect(ticketResponse.body.title).toEqual(updatedTitle);
  expect(ticketResponse.body.price).toEqual(updatedPrice);
});
