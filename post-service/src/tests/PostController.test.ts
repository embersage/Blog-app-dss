import request from 'supertest';
import express from 'express';
import router from '../routes/index';
import AppDataSource from '../database/connection';

const app = express();
app.use(express.json());
app.use('/api', router);
AppDataSource.initialize();

const TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg5MDI1ZjI1LTE1NTMtNDRmMC05NzVlLWQzYzFiMDAxZTYyZiIsImlhdCI6MTc0MjEyNzc2NywiZXhwIjoxNzQyMjE0MTY3fQ.ToAlCHgMl7WbxiqhUmqMtfMtFLiZ1BNQJiqdfQTd1Es';

describe('POST /api/posts', () => {
  it('should create a post', async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const response = await request(app).post('/api/posts').auth(TOKEN, { type: 'bearer' }).send({
      title: 'New Post',
      text: 'This is a new post content',
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('title', 'New Post');
    expect(response.body).toHaveProperty('text', 'This is a new post content');
  });
});

describe('GET /api/posts', () => {
  it('should return a list of posts', async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const response = await request(app).get('/api/posts');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});

describe('DELETE /api/posts/:id', () => {
  it('should delete a post', async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const postId = '9f0fcb8a-c85a-41de-90f4-2e41133568bd';

    const response = await request(app).delete(`/api/posts/${postId}`).auth(TOKEN, { type: 'bearer' });

    expect(response.status).toBe(200);
  });
});
