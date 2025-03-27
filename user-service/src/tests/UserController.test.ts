// @ts-nocheck
import request from 'supertest';
import express from 'express';
import router from '../routes';
import AppDataSource from '../database/connection';

const app = express();
app.use(express.json());
app.use('/api', router);

describe('User Controller Tests', () => {
  let userToken: string;
  const testEmail = `test${Date.now()}@example.com`;

  beforeAll(async () => {
    await AppDataSource.initialize();
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  describe('POST /api/users/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/users/register')
        .send({
          name: 'Test User',
          email: testEmail,
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('name', 'Test User');
      expect(response.body.user).toHaveProperty('email', testEmail);
      expect(response.body).toHaveProperty('token');
      
      userToken = response.body.token;
    });

    it('should not register user with existing email', async () => {
      const response = await request(app)
        .post('/api/users/register')
        .send({
          name: 'Test User 2',
          email: testEmail,
          password: 'password123'
        });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message');
    });

    it('should not register user without required fields', async () => {
      const response = await request(app)
        .post('/api/users/register')
        .send({
          name: 'Test User'
        });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/users/login', () => {
    it('should login registered user', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: testEmail,
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('email', testEmail);
    });

    it('should not login with incorrect password', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: testEmail,
          password: 'wrongpassword'
        });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message', 'Неверный логин или пароль');
    });

    it('should not login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message', 'Неверный логин или пароль');
    });
  });

  describe('GET /api/users/check_auth', () => {
    it('should check auth with valid token', async () => {
      const response = await request(app)
        .get('/api/users/check_auth')
        .auth(userToken, { type: 'bearer' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email', testEmail);
    });

    it('should fail without token', async () => {
      const response = await request(app)
        .get('/api/users/check_auth');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Пользователь не авторизован.');
    });

    it('should fail with invalid token', async () => {
      const response = await request(app)
        .get('/api/users/check_auth')
        .auth('invalid_token', { type: 'bearer' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Пользователь не авторизован.');
    });
  });
});
