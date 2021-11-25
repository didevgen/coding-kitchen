import { postService } from '../../services/post.service';

export const postQueries = {
  posts() {
    return postService.findPosts();
  },
  post(parent: any, { postId }: { postId: string }) {
    return postService.findPost(postId);
  }
};
