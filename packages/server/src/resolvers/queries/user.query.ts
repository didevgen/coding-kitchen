import { userService } from '../../services/user.service';

export class AuthError extends Error {
  constructor() {
    super('Not authorized');
  }
}

export const userQueries = {
  users() {
    return userService.findUsers();
  },
  user(parent: any, { id }: { id: string }) {
    return userService.findUser(id);
  },
  getUserInfo(parent, args, context) {
    try {
      return userService.findUser(context.currentUser.id);
    } catch (e) {
      throw new AuthError();
    }
  }
};
