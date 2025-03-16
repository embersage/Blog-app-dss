import { User } from '../database/models/User';
import { AppDataSource } from '../database/connection';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

export class AuthenticationService {
  static async login(email: string, password: string) {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ email });

    if (!user) throw new Error('Invalid credentials');

    const isEqual = await bcrypt.compare(password, user.passwordHash);
    if (!isEqual) throw new Error('Invalid credentials');

    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY as string, { expiresIn: '24h' });
    
    return { user, token };
  }

  static async register(name: string, email: string, password: string) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userRepository = AppDataSource.getRepository(User);
    const user = userRepository.create({ name, email, passwordHash: hashedPassword });

    return await userRepository.save(user);
  }

  static async checkAuthorization(id: string) {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id });
    if (!user) throw new Error('User not found');

    return user;
  }
}
