import * as mongoose from 'mongoose';
import { Document, Schema } from 'mongoose';
import { User } from './user';

export interface Post extends Document {
  description: string;
  imageUrl: string;
  likes: User[];
  comments: Comment[];
  author: User;
  isDeleted: boolean;
}

const PostSchema: Schema = new Schema(
  {
    description: { type: Schema.Types.String, required: true },
    imageUrl: { type: Schema.Types.String, required: true },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: () => {
          return [];
        }
      }
    ],
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        default: () => {
          return [];
        }
      }
    ],
    isDeleted: { type: Schema.Types.Boolean }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

export const PostModel = mongoose.model<Post>('Post', PostSchema);
