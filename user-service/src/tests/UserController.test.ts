import request from 'supertest';
import express from 'express';
import router from '../routes';
import AppDataSource from '../database/connection';

const app = express();
app.use(express.json());
app.use('/api', router);
AppDataSource.initialize();

describe('POST /api/users/register', () => {
  it('should register a user', async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const response = await request(app).post('/api/users/register').send({
      name: 'Test User 1',
      email: 'testuser1@example.com',
      password: 'password123',
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('user');
  });
});

describe('POST /api/users/login', () => {
  it('should log in a user', async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const response = await request(app).post('/api/users/login').send({
      email: 'testuser@example.com',
      password: 'password123',
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});
