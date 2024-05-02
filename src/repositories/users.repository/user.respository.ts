import { type PrismaClient } from '@prisma/client';
import { type Repo } from '../type.repo';
import {
  type UserCreateAndUpdateDto,
  type User,
} from '../../entities/users.entity/users.entity';
import { HttpError } from '../../middleware/errors.middleware/errors.middleware.js';
import createDebug from 'debug';

const debug = createDebug('FP*:repository');

const select = {
  id: true,
  name: true,
  email: true,
  imageUrl: true,
  role: true,
  projects: {
    select: {
      id: true,
      title: true,
      content: true,
      archieve: true,
      category: true,
    },
  },
};

export class UserRepository implements Repo<User, UserCreateAndUpdateDto> {
  constructor(private readonly prisma: PrismaClient) {
    debug('instantiated user repository');
  }

  async readAll() {
    return this.prisma.user.findMany({ select });
  }

  async readById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select,
    });
    if (!user) {
      throw new HttpError(404, 'Not found', 'User with this id not found');
    }

    return user;
  }

  async create(data: UserCreateAndUpdateDto) {
    const newUser = this.prisma.user.create({
      data,
      select,
    });
    return newUser;
  }

  async update(id: string, data: UserCreateAndUpdateDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new HttpError(404, 'Not found', 'User with this id not found');
    }

    return this.prisma.user.update({
      where: { id },
      data,
      select,
    });
  }

  async delete(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select,
    });
    if (!user) {
      throw new HttpError(404, 'Not found', 'User with this id not found');
    }

    return this.prisma.user.delete({
      where: { id },
      select,
    });
  }

  async searchForLogin(key: 'email', value: string) {
    if (!'email'.includes(key)) {
      throw new HttpError(404, 'Not Found', 'Invalid query parameters');
    }

    const userData = await this.prisma.user.findFirst({
      where: { [key]: value },
      select: { id: true, password: true, email: true, role: true },
    });

    if (!userData) {
      throw new HttpError(404, 'Not Found', `Invalid ${key} or password`);
    }

    return userData;
  }
}
