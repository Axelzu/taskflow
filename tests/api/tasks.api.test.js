const request = require('supertest');
const createApp = require('../../src/app');
const TaskRepository = require('../../src/tasks.repository');

describe('API /api/tasks', () => {
  let app;
  beforeEach(() => { app = createApp(new TaskRepository(null)); });

  test('GET /api/health responde ok', async () => {
    await request(app).get('/api/health').expect(200);
  });

  test('POST crea y GET lista', async () => {
    await request(app).post('/api/tasks').send({ title: 'Probar API' }).expect(201);
    const res = await request(app).get('/api/tasks');
    expect(res.body).toHaveLength(1);
  });

  test('POST con título inválido devuelve 400', async () => {
    await request(app).post('/api/tasks').send({ title: 'x' }).expect(400);
  });

  test('PATCH y DELETE de un id inexistente devuelven 404', async () => {
    await request(app).patch('/api/tasks/99/toggle').expect(404);
    await request(app).delete('/api/tasks/99').expect(404);
  });
});
