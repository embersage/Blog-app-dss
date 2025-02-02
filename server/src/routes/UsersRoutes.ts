import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { checkAuth } from '../middlewares/checkAuth';

class UsersRoutes {
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post('/login', UserController.login);
    this.router.post('/register', UserController.register);
    this.router.get('/check_auth', checkAuth, UserController.checkAuthorization);
  }
}

export default new UsersRoutes().router;
