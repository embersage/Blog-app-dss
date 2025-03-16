import { Request, Response, NextFunction } from 'express';
import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

interface JwtPayload {
  id: string;
}

const checkAuth: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || '';
    if (!token) {
      return res.status(401).json({ message: 'Пользователь не авторизован.' });
    }
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY as string) as JwtPayload;
    req.userId = decodedToken.id as string;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Пользователь не авторизован.' });
  }
};

export default checkAuth;
