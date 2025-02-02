import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import 'reflect-metadata';
import { AppDataSource } from './database/connection';
import router from './routes/index';

config();

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', router);
app.use('/uploads', express.static('uploads'));

const start = () => {
  try {
    app.listen(PORT, () => {
      AppDataSource.initialize();
      console.log(`Server is working on port ${PORT}.`);
    });
  } catch (error) {
    console.log(`The error has occurred: ${error}`);
  }
};

start();
