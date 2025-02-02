import { AppDataSource } from '../database/connection';
import { Post } from '../database/models/Post';
import { User } from '../database/models/User';
import { ILike } from 'typeorm';

export class PostService {
  static async getAll(search: string, field: string, order: string) {
    const postRepository = AppDataSource.getRepository(Post);
    const posts = await postRepository.find({
      where: {
        title: ILike(`%${search}%`),
      },
      order: {
        [field]: order,
      },
      relations: ['user'],
    });

    return posts;
  }

  static async getOne(id: string) {
    const postRepository = AppDataSource.getRepository(Post);
    const post = await postRepository.findOne({ where: { id }, relations: ['user'] });

    return post;
  }

  static async create(userId: string, title: string, text: string, image: string) {
    const postRepository = AppDataSource.getRepository(Post);
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOneBy({ id: userId });
    if (!user) throw new Error('User not found');

    const post = postRepository.create({ title, text, image, user });
    return await postRepository.save(post);
  }

  static async edit(id: string, title: string, text: string, image: string) {
    const postRepository = AppDataSource.getRepository(Post);
    const post = await postRepository.findOneBy({ id });
    if (!post) throw new Error('Post not found');

    post.title = title;
    post.text = text;
    post.image = image;

    return await postRepository.save(post);
  }

  static async delete(id: string) {
    const postRepository = AppDataSource.getRepository(Post);
    await postRepository.delete(id);
  }
}
