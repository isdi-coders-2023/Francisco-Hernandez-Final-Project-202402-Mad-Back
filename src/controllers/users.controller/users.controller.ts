import { type Response, type Request, type NextFunction } from 'express';
import {
  type User,
  type UserCreateAndUpdateDto,
} from '../../entities/users.entity/users.entity';
import { type UserRepository } from '../../repositories/users.repository/user.respository';
import { BaseController } from '../base.controller.js';
import createDebug from 'debug';
import { HttpError } from '../../middleware/errors.middleware/errors.middleware.js';
import { Auth } from '../../services/auth.services/auth.services.js';

const debug = createDebug('FP*:controller');

export class UserController extends BaseController<
  User,
  UserCreateAndUpdateDto
> {
  constructor(protected readonly repo: UserRepository) {
    debug('instantiated user controller');
    super(repo);
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body as UserCreateAndUpdateDto;

    if (!email || !password) {
      next(
        new HttpError(400, 'Bad Request', 'Email and password are required')
      );
      return;
    }

    const error = new HttpError(
      401,
      'Unauthorized',
      'Email and password invalid'
    );

    try {
      const user = await this.repo.searchForLogin('email', email);

      if (!user) {
        next(error);
        return;
      }

      if (!(await Auth.compare(password, user.password))) {
        next(error);
        return;
      }

      const token = Auth.signJwt({
        id: user.id,
        role: user.role,
        email: user.email,
      });

      res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  }

  async createUser(req: Request, res: Response, next: NextFunction) {
    const data = req.body as UserCreateAndUpdateDto;
    data.password = await Auth.hash(data.password, 10);

    try {
      const result = await this.repo.create(data);
      res.status(201);
      res.json(result);
      await super.create(req, res, next);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    req.body.imageUrl = req.body.archive as string;
    delete req.body.archive;
    await super.update(req, res, next);
  }

  async getSavedProjects(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.params;
    try {
      const savedProjects = await this.repo.getSavedProjects(userId);
      res.status(200).json(savedProjects);
    } catch (error) {
      next(error);
    }
  }

  async saveProject(req: Request, res: Response, next: NextFunction) {
    const { userId, projectId } = req.params;
    try {
      const result = await this.repo.saveProject(userId, projectId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async removeSavedProject(req: Request, res: Response, next: NextFunction) {
    const { userId, projectId } = req.params;
    try {
      const result = await this.repo.removeSavedProject(userId, projectId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
