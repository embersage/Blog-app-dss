import { Request, Response } from 'express';
import { PostService } from '../services/PostService';

export class PostController {
  static async getAll(req: Request, res: Response) {
    try {
      const { search = '', field, order } = req.query;
      const posts = await PostService.getAll(String(search), field as string, order as string);
      return res.status(200).json(posts);
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching posts' });
    }
  }

  static async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const post = await PostService.getOne(id);
      if (!post) return res.status(404).json({ message: 'Post not found' });
      return res.status(200).json(post);
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching post' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const userId = req.userId;
      const { title, text, image } = req.body;
      const post = await PostService.create(String(userId), title, text, image);
      return res.status(201).json(post);
    } catch (error) {
      return res.status(500).json({ message: 'Error creating post' });
    }
  }

  static async edit(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, text, image } = req.body;
      const updatedPost = await PostService.edit(id, title, text, image);
      return res.status(200).json(updatedPost);
    } catch (error) {
      return res.status(500).json({ message: 'Error updating post' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await PostService.delete(id);
      return res.status(200).json({ message: 'Post deleted' });
    } catch (error) {
      return res.status(500).json({ message: 'Error deleting post' });
    }
  }
}
