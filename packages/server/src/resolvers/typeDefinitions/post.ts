import { Post } from '../../db/post';
import { User } from '../../db/user';
import { postService } from '../../services/post.service';
import { userService } from '../../services/user.service';

export const PostResolvers = {
  async lazyComments(parent: Post): Promise<any> {
    return (await postService.getComments(parent.id)) || [];
  },
  async author(parent: Post): Promise<User> {
    // @ts-ignore
    return userService.findUser((parent.author as string));
  },
  async isLiked(parent: Post, args, { currentUser }): Promise<boolean> {
    return postService.isLiked(parent.id, currentUser.id);
  }
};
