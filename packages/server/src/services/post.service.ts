import mongoose from 'mongoose';
import { S3ImageUploader } from '../aws/s3ImageUploader';
import { CommentModel } from '../db/comment';
import { Post, PostModel } from '../db/post';
import { UploadedFile } from './imageService';
import { PhotosService } from './photos';

export interface PostInput {
  description: string;
}

interface BasePostOperations {
  findPost(id: string): Promise<Post>;

  findPosts(): Promise<Post[]>;

  commentPost(postId: string, text: string, userId: string): Promise<void>;

  getComments(postId): Promise<Comment[]>;

  createPost(postData: PostInput, image: UploadedFile, user: string): Promise<Post | null>;
}

export class PostService implements BasePostOperations {
  public async findPost(id: string): Promise<Post> {
    return PostModel.findById(id);
  }

  public async findPosts(): Promise<Post[]> {
    return PostModel.find({});
  }

  public async createPost(postData: PostInput, image: UploadedFile, user: string): Promise<Post | null> {
    try {
      const imageUrl = await new PhotosService(new S3ImageUploader(user)).addImage(image);
      const post = {
        ...postData,
        author: user,
        imageUrl
      };
      return await PostModel.create(post);
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async commentPost(postId: string, comment: string, author: string): Promise<void> {
    await CommentModel.create({
      comment,
      post: postId,
      author
    });
  }

  async getComments(postId: string): Promise<Comment[]> {
    return CommentModel.find({ post: new mongoose.Types.ObjectId(postId) }).populate({
      path: 'author'
    });
  }

  async likePost(postId: string, userId: string, isLiked: boolean): Promise<void> {
    if (isLiked) {
      await PostModel.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(postId) }, { $push: { likes: userId } });
    } else {
      await PostModel.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(postId) }, { $pull: { likes: userId } });
    }
  }

  async isLiked(postId: string, userId: string): Promise<boolean> {
    const post = await PostModel.findById(postId)
      .populate('likes')
      .exec();
    return !!post.likes.find(user => user.id === userId);
  }
}

export const postService = new PostService();
