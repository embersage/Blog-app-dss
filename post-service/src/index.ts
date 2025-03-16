import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import 'reflect-metadata';
import AppDataSource from './database/connection.js';
import router from './routes/index.js';

config();

const PORT = process.env.PORT || 5002;

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', router);
app.use('/uploads', express.static('uploads'));

const start = () => {
  try {
    app.listen(PORT, () => {
      AppDataSource.initialize();
      console.log(`Post service is working on port ${PORT}.`);
    });
  } catch (error) {
    console.log(`The error has occurred: ${error}`);
  }
};

start();
