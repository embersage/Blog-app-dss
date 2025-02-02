import { Request, Response } from 'express';
import { AuthenticationService } from '../services/AuthenticationService';

export class UserController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const { user, token } = await AuthenticationService.login(email, password);
      return res.status(200).json({ user, token });
    } catch (error) {
      return res.status(500).json({ message: 'Login failed' });
    }
  }

  static async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      const user = await AuthenticationService.register(name, email, password);
      return res.status(200).json({ user });
    } catch (error) {
      return res.status(500).json({ message: 'Registration failed' });
    }
  }

  static async checkAuthorization(req: Request, res: Response) {
    try {
      const id = req.userId;
      const user = await AuthenticationService.checkAuthorization(String(id));
      return res.status(200).json(user);
    } catch (error) {
      return res.status(404).json({ message: 'User not found' });
    }
  }
}
