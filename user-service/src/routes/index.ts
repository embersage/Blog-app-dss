import { Router } from 'express';
import UsersRoutes from './UsersRoutes';

class Routes {
  router = Router();

  constructor() {
    this.router.use('/users', UsersRoutes);
  }
}

export default new Routes().router;
