// @ts-nocheck
import { Request, Response } from 'express';
import Post from '../database/models/Post';
import { ILike } from 'typeorm';
import AppDataSource from '../database/connection';
import User from '../database/models/User';
import logger from '../utils/logger';

class PostController {
  static async getAll(req: Request, res: Response) {
    try {
      const { field, order } = req.query;
      let { search } = req.query;
      search = search || '';

      const postRepository = AppDataSource.getRepository(Post);
      const posts = await postRepository.find({
        where: {
          title: ILike(`%${search}%`),
        },
        order: {
          [field as string]: order,
        },
        relations: ['user'],
      });

      const response = posts.map((post) => ({
        ...post,
        user: {
          id: post.user.id,
          name: post.user.name,
        },
      }));

      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ message: 'Ошибка при получении ресурсов.' });
    }
  }

  static async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const postRepository = AppDataSource.getRepository(Post);
      const post = await postRepository.findOne({ where: { id }, relations: ['user'] });

      if (post) {
        post.views++;
        await postRepository.save(post);
        const response = {
          ...post,
          user: {
            id: post.user.id,
            name: post.user.name,
          },
        };
        return res.status(200).json(response);
      }
    } catch (error) {
      return res.status(404).json({ message: 'Ошибка при получении ресурса.' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const userId = req.userId;
      const { title, text, image } = req.body;

      logger.info('Creating new post', {
        userId,
        service: 'post-service',
        action: 'create_post',
      });

      const postRepository = AppDataSource.getRepository(Post);
      const userRepository = AppDataSource.getRepository(User);

      const user = await userRepository.findOneBy({ id: userId });
      if (user) {
        const post = postRepository.create({ title, text, image, user });
        const createdPost = await AppDataSource.getRepository(Post).save(post);

        logger.info('Post created successfully', {
          postId: createdPost.id,
          userId,
          service: 'post-service',
        });

        return res.status(201).json(createdPost);
      }
    } catch (error) {
      logger.error('Post creation error', {
        error: error.message,
        userId: req.userId,
        service: 'post-service',
      });
      return res.status(500).json({ message: 'Ошибка при создании ресурса.' });
    }
  }

  static async edit(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, text, image } = req.body;

      const postRepository = AppDataSource.getRepository(Post);
      const post = await postRepository.findOneBy({ id });

      if (post) {
        post.title = title;
        post.text = text;
        post.image = image;
        const updatedPost = await postRepository.save(post);

        return res.status(200).json(updatedPost);
      }
    } catch (error) {
      return res.status(500).json({ message: 'Ошибка при редактировании ресурса.' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const postRepository = AppDataSource.getRepository(Post);
      const post = await postRepository.delete(id);

      return res.status(200).json(post);
    } catch (error) {
      return res.status(500).json({ message: 'Ошибка при удалении ресурса.' });
    }
  }
}

export default PostController;
