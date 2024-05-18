import { type PrismaClient } from '@prisma/client';
import cors from 'cors';
import express, { type Express } from 'express';
import morgan from 'morgan';
import { UserRepository } from './repositories/users.repository/user.respository.js';
import { UserController } from './controllers/users.controller/users.controller.js';
import { UserRouter } from './routers/users.routers/user.router.js';
import createDebug from 'debug';
import { AuthMiddleware } from './middleware/auth.middleware/auth.middleware.js';
import { ProjectRepository } from './repositories/projects.repository/project.repository.js';
import { ProjectController } from './controllers/projects.controller/projects.controller.js';
import { ProjectRouter } from './routers/projects.router/project.router.js';
import { FilesMiddleware } from './middleware/files.middleware/files.middleware.js';

const debug = createDebug('FP*:app');

export const createApp = () => {
  debug('creating app');
  return express();
};

export const startApp = (app: Express, prisma: PrismaClient) => {
  debug('starting app');
  app.use(express.json());
  app.use(morgan('dev'));
  app.use(cors());

  const authInterceptor = new AuthMiddleware();

  const filesMiddleware = new FilesMiddleware();

  const usersRepo = new UserRepository(prisma);
  const usersController = new UserController(usersRepo);
  const usersRouter = new UserRouter(
    usersController,
    authInterceptor,
    filesMiddleware
  );
  app.use('/users', usersRouter.router);

  const projectsRepo = new ProjectRepository(prisma);
  const projectsController = new ProjectController(projectsRepo);
  const projectsRouter = new ProjectRouter(
    projectsController,
    authInterceptor,
    filesMiddleware,
    projectsRepo
  );
  app.use('/projects', projectsRouter.router);
};
