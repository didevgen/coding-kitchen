import { PostModel } from '../../db/post';
import { UploadedFile } from '../../services/imageService';
import { PostInput, postService } from '../../services/post.service';

export const postMutations = {
  async createPost(
    obj: any,
    { postData, image }: { postData: PostInput; image: Promise<UploadedFile> },
    { currentUser }
  ) {
    return postService.createPost(postData, await image, currentUser.id);
  },
  async deletePost(_, { id }) {
    await PostModel.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false
      },
      {
        $set: {
          isDeleted: true
        }
      }
    );
    return true;
  },
  async commentPost(obj: any, { postId, text }: { postId: string; text: string }, { currentUser }) {
    await postService.commentPost(postId, text, currentUser.id);
    return true;
  },
  async commentPostImmidiateUpdate(obj: any, { postId, text }: { postId: string; text: string }, { currentUser }) {
    await postService.commentPost(postId, text, currentUser.id);
    return postService.findPost(postId);
  },
  async likePost(_, { postId, isLiked }, { currentUser }) {
    await postService.likePost(postId, currentUser.id, isLiked);
  }
};
