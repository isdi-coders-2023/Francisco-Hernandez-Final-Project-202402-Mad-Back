import { Router as createRouter } from 'express';
import createDebug from 'debug';
import { type AuthMiddleware } from '../../middleware/auth.middleware/auth.middleware.js';
import { type ProjectController } from '../../controllers/projects.controller/projects.controller.js';
import { type FilesMiddleware } from '../../middleware/files.middleware/files.middleware.js';

const debug = createDebug('FP*:router');

export class ProjectRouter {
  router = createRouter();

  constructor(
    protected readonly projectController: ProjectController,
    protected authMiddleware: AuthMiddleware,
    protected filesMiddleware: FilesMiddleware
  ) {
    debug('instantiated project router');

    this.router.get(
      '/',
      authMiddleware.authentication.bind(authMiddleware),
      projectController.getAll.bind(projectController)
    );

    this.router.get(
      '/:id',
      authMiddleware.authentication.bind(authMiddleware),
      projectController.getById.bind(projectController)
    );

    this.router.post(
      '/',
      filesMiddleware.uploadFile('archive').bind(filesMiddleware),
      filesMiddleware.cloudinaryUpload.bind(filesMiddleware),
      authMiddleware.authentication.bind(authMiddleware),
      projectController.create.bind(projectController)
    );

    this.router.patch(
      '/:id',
      filesMiddleware.uploadFile('archive').bind(filesMiddleware),
      filesMiddleware.cloudinaryUpload.bind(filesMiddleware),
      authMiddleware.authentication.bind(authMiddleware),
      projectController.update.bind(projectController)
    );

    this.router.delete(
      '/:id',
      authMiddleware.authentication.bind(authMiddleware),
      projectController.delete.bind(projectController)
    );
  }
}
