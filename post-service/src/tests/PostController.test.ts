// @ts-nocheck
import request from 'supertest';
import express from 'express';
import router from '../routes/index';
import AppDataSource from '../database/connection';
import { DataSource } from 'typeorm';
import User from '../database/models/User';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());
app.use('/api', router);

describe('Post Controller Tests', () => {
  let userToken: string;
  let testPostId: string;
  let testUser: User;

  beforeAll(async () => {
    await AppDataSource.initialize();

    const userRepository = AppDataSource.getRepository(User);
    testUser = userRepository.create({
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      passwordHash: 'hashedpassword123',
    });
    await userRepository.save(testUser);

    userToken = jwt.sign({ id: testUser.id }, process.env.SECRET_KEY || 'test_secret_key', { expiresIn: '24h' });
  });

  afterAll(async () => {
    if (testUser) {
      const userRepository = AppDataSource.getRepository(User);
      await userRepository.delete(testUser.id);
    }
    await AppDataSource.destroy();
  });

  describe('POST /api/posts', () => {
    it('should create a post', async () => {
      const response = await request(app).post('/api/posts').auth(userToken, { type: 'bearer' }).send({
        title: 'Test Post',
        text: 'This is a test post content',
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('title', 'Test Post');
      expect(response.body).toHaveProperty('text', 'This is a test post content');
      expect(response.body).toHaveProperty('id');

      testPostId = response.body.id;
    });

    it('should not create a post without authentication', async () => {
      const response = await request(app).post('/api/posts').send({
        title: 'Test Post',
        text: 'This is a test post content',
      });

      expect(response.status).toBe(401);
    });

    it('should not create a post without title', async () => {
      const response = await request(app).post('/api/posts').auth(userToken, { type: 'bearer' }).send({
        text: 'This is a test post content',
      });

      expect(response.status).toBe(500);
    });
  });

  describe('GET /api/posts', () => {
    it('should return a list of posts', async () => {
      const response = await request(app).get('/api/posts');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should return posts with search parameter', async () => {
      const response = await request(app).get('/api/posts').query({ search: 'Test' });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return posts with sorting', async () => {
      const response = await request(app).get('/api/posts').query({
        field: 'createdAt',
        order: 'DESC',
      });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/posts/:id', () => {
    it('should return a single post', async () => {
      const response = await request(app).get(`/api/posts/${testPostId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', testPostId);
      expect(response.body).toHaveProperty('title', 'Test Post');
      expect(response.body.views).toBeGreaterThanOrEqual(0);
    });

    it('should return 404 for non-existent post', async () => {
      const response = await request(app).get('/api/posts/non-existent-id');

      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /api/posts/:id', () => {
    it('should update a post', async () => {
      const response = await request(app).patch(`/api/posts/${testPostId}`).auth(userToken, { type: 'bearer' }).send({
        title: 'Updated Test Post',
        text: 'This is updated test content',
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('title', 'Updated Test Post');
      expect(response.body).toHaveProperty('text', 'This is updated test content');
    });

    it('should not update post without authentication', async () => {
      const response = await request(app).patch(`/api/posts/${testPostId}`).send({
        title: 'Updated Test Post',
        text: 'This is updated test content',
      });

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/posts/:id', () => {
    it('should delete a post', async () => {
      const response = await request(app).delete(`/api/posts/${testPostId}`).auth(userToken, { type: 'bearer' });

      expect(response.status).toBe(200);

      const getResponse = await request(app).get(`/api/posts/${testPostId}`);
      expect(getResponse.status).toBe(404);
    });

    it('should not delete post without authentication', async () => {
      const response = await request(app).delete(`/api/posts/${testPostId}`);

      expect(response.status).toBe(401);
    });
  });
});
