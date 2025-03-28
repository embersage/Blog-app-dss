// @ts-nocheck
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { config } from 'dotenv';
import User from '../database/models/User';
import AppDataSource from '../database/connection';
import { logInfo, logError, logWarn } from '../utils/logger';

config();

class UserController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      logInfo('Login attempt', { email });

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOneBy({ email });
      if (!user) {
        logWarn('Login failed - user not found', { email });
        return res.status(500).json({ message: 'Неверный логин или пароль' });
      }

      const isEqual = await bcrypt.compareSync(password, user.passwordHash);
      if (!isEqual) {
        logWarn('Login failed - incorrect password', { email });
        return res.status(500).json({ message: 'Неверный логин или пароль' });
      }

      const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY as string, { expiresIn: '24h' });

      logInfo('Login successful', { userId: user.id });

      return res.status(200).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        token,
      });
    } catch (error) {
      logError('Login failed', error, { email: req.body.email });
      return res.status(500).json({ message: 'Ошибка при авторизации.' });
    }
  }

  static async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const userRepository = AppDataSource.getRepository(User);
      const user = userRepository.create({ name, email, passwordHash: hashedPassword });
      const newUser = await AppDataSource.getRepository(User).save(user);

      const token = jwt.sign({ id: newUser.id }, process.env.SECRET_KEY as string, { expiresIn: '24h' });

      return res.status(200).json({ user, token });
    } catch (error) {
      return res.status(500).json({ message: 'Ошибка при регистрации.' });
    }
  }

  static async checkAuthorization(req: Request, res: Response) {
    try {
      const id = req.userId;

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOneBy({ id });

      if (user) {
        return res.status(200).json({
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        });
      }

      return res.status(404).json({ message: 'Пользователь не найден' });
    } catch (error) {
      return res.status(500).json({ message: 'Ошибка при проверке пользователя.' });
    }
  }
}

export default UserController;
