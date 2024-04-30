import { type UserController } from '../../controllers/users.controller/users.controller';
import { Router as createRouter } from 'express';
import createDebug from 'debug';

const debug = createDebug('FP*:router');

export class UserRouter {
  router = createRouter();

  constructor(protected readonly userController: UserController) {
    debug('instantiated user router');

    this.router.get('/', userController.getAll.bind(userController));

    this.router.get('/:id', userController.getById.bind(userController));

    this.router.post('/', userController.create.bind(userController));

    this.router.patch('/:id', userController.update.bind(userController));

    this.router.delete('/:id', userController.delete.bind(userController));
  }
}
