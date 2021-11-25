import * as bcrypt from 'bcryptjs';
import { User, UserModel } from '../db/user';

interface BaseUserOperations {
  findUser(id: string): Promise<User>;
  findUsers(): Promise<User[]>;
  createUser(userData: User): Promise<User | null>;
}

export class UserService implements BaseUserOperations {
  public async findUser(id: string): Promise<User> {
    return UserModel.findById(id);
  }

  public async findUsers(): Promise<User[]> {
    return UserModel.find({});
  }

  public async createUser(userData: User): Promise<User | null> {
    try {
      userData.password = bcrypt.hashSync(userData.password);
      return await UserModel.create(userData);
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}

export const userService = new UserService();
