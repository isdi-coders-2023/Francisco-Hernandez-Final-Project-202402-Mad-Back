import {
  type User,
  type UserCreateAndUpdateDto,
} from '../../entities/users.entity/users.entity';
import { type UserRepository } from '../../repositories/users.repository/user.respository';
import { BaseController } from '../base.controller.js';
import createDebug from 'debug';

const debug = createDebug('FP*:controller');

export class UserController extends BaseController<
  User,
  UserCreateAndUpdateDto
> {
  constructor(protected readonly repo: UserRepository) {
    debug('instantiated user controller');
    super(repo);
  }
}
