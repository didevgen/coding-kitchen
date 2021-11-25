import { ApolloError } from 'apollo-server-express';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { User, UserModel } from '../../db/user';
import { userService } from '../../services/user.service';

export function authTokenGenerate(user: User) {
  return jwt.sign({ userId: user._id }, process.env.APP_SECRET, {
    expiresIn: '1d'
  });
}

export const userMutations = {
  createUser(obj: any, { userData }: { userData: User }) {
    return userService.createUser(userData);
  },
  async login(parent, { email, password }, { redis }) {
    const user = await UserModel.findOne({ email });
    if (!user || user.isDeleted) {
      throw new ApolloError(`No such user found for email: ${email}`, '404');
    }
    const valid = await bcrypt.compareSync(password, user.password);
    if (!valid) {
      throw new ApolloError('Unauthorized', '401');
    }
    const token = authTokenGenerate(user);
    await redis.set(token, JSON.stringify({ id: user._id }), 'ex', 86400);
    return { token };
  }
};
