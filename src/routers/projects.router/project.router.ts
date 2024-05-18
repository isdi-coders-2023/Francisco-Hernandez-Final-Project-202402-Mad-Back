import { Router as createRouter } from 'express';
import createDebug from 'debug';
import { type AuthMiddleware } from '../../middleware/auth.middleware/auth.middleware.js';
import { type ProjectController } from '../../controllers/projects.controller/projects.controller.js';
import { type FilesMiddleware } from '../../middleware/files.middleware/files.middleware.js';
import { type ProjectRepository } from '../../repositories/projects.repository/project.repository.js';

const debug = createDebug('FP*:router');

export class ProjectRouter {
  router = createRouter();

  constructor(
    protected readonly projectController: ProjectController,
    protected authMiddleware: AuthMiddleware,
    protected filesMiddleware: FilesMiddleware,
    protected projectRepo: ProjectRepository
  ) {
    debug('instantiated project router');

    this.router.get(
      '/',
      authMiddleware.authentication.bind(authMiddleware),
      projectController.getAll.bind(projectController)
    );

    // Tthis.router.get(
    //   '/:id',
    //   authMiddleware.authentication.bind(authMiddleware),
    //   projectController.getById.bind(projectController)
    // );

    this.router.get(
      '/:category',
      authMiddleware.authentication.bind(authMiddleware),
      projectController.filterByCategory.bind(projectController)
    );

    this.router.post(
      '/',
      authMiddleware.authentication.bind(authMiddleware),
      filesMiddleware.uploadFile('archive').bind(filesMiddleware),
      filesMiddleware.cloudinaryUpload.bind(filesMiddleware),
      projectController.create.bind(projectController)
    );

    this.router.patch(
      '/:id',
      // AauthMiddleware.authentication.bind(authMiddleware),
      // authMiddleware.authorization(projectRepo, 'author').bind(authMiddleware),
      filesMiddleware.uploadFile('archive').bind(filesMiddleware),
      filesMiddleware.cloudinaryUpload.bind(filesMiddleware),

      projectController.update.bind(projectController)
    );

    this.router.delete(
      '/:id',
      // A authMiddleware.authentication.bind(authMiddleware),
      // authMiddleware.authorization(projectRepo, 'author').bind(authMiddleware),
      projectController.delete.bind(projectController)
    );
  }
}
