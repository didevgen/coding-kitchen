import * as mongoose from 'mongoose';
import { Document, Schema } from 'mongoose';
import { User } from './user';

export interface Comment extends Document {
  comment: string;
  likes: User[];
  author: User;
  isDeleted: boolean;
}

const CommentSchema: Schema = new Schema(
  {
    comment: { type: Schema.Types.String, required: true },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post'
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
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

export const CommentModel = mongoose.model<Comment>('Comment', CommentSchema);
