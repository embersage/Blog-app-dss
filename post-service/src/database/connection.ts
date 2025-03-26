// @ts-nocheck
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import User from './models/User';
import Post from './models/Post';

config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST as string,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
  entities: [User, Post],
  synchronize: true,
  logging: false,
});

export default AppDataSource;
