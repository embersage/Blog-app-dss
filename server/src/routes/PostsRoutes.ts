import { Router } from 'express';
import { PostController } from '../controllers/PostController';
import { checkAuth } from '../middlewares/checkAuth';
import multer from 'multer';

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, 'uploads');
  },
  filename(req, file, callback) {
    callback(null, file.originalname);
  },
});

export const upload = multer({ storage });

class PostsRoutes {
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/', PostController.getAll);
    this.router.get('/:id', PostController.getOne);
    this.router.post('/', checkAuth, PostController.create);
    this.router.post('/upload', checkAuth, upload.single('image'), (req, res) => {
      return res.json({ url: `uploads/${req.file?.originalname}` });
    });
    this.router.patch('/:id', checkAuth, PostController.edit);
    this.router.delete('/:id', checkAuth, PostController.delete);
  }
}

export default new PostsRoutes().router;
