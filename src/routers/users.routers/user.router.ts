import { type UserController } from '../../controllers/users.controller/users.controller';
import { Router as createRouter } from 'express';
import createDebug from 'debug';
import { type AuthMiddleware } from '../../middleware/auth.middleware/auth.middleware';

const debug = createDebug('FP*:router');

export class UserRouter {
  router = createRouter();

  constructor(
    protected readonly userController: UserController,
    protected authMiddleware: AuthMiddleware
  ) {
    debug('instantiated user router');

    this.router.post(
      '/register',
      userController.createUser.bind(userController)
    );

    this.router.post('/login', userController.login.bind(userController));

    this.router.get('/', userController.getAll.bind(userController));

    this.router.get('/:id', userController.getById.bind(userController));

    this.router.patch(
      '/:id',
      // AauthMiddleware.authentication.bind(authMiddleware),
      userController.update.bind(userController)
    );

    this.router.delete(
      '/:id',
      authMiddleware.authentication.bind(authMiddleware),
      userController.delete.bind(userController)
    );
  }
}
