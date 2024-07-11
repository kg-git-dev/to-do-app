import request from 'supertest';
import { startServer } from '../test.index'; 
import { getDB, disconnectDB } from '../mongodb';

describe('Auth API', () => {
  let server;
  let db;

  beforeAll(async () => {
    server = await startServer(); 
    db = getDB();
  });

  afterAll(async () => {
    server.close(); 
    await db.dropDatabase();
    await disconnectDB();
  });

  it('should create a new user', async () => {
    const response = await request(server)
      .post('/auth/register')
      .send({ username: 'testuser123', password: 'password123' });

    expect(response.status).toBe(201);
  });

});
