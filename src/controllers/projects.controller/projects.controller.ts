import { BaseController } from '../base.controller.js';
import createDebug from 'debug';
import { type Response, type Request, type NextFunction } from 'express';

import {
  type Project,
  type ProjectDto,
} from '../../entities/projects.entitty/projects.entity.js';
import { type ProjectRepository } from '../../repositories/projects.repository/project.repository.js';
import { HttpError } from '../../middleware/errors.middleware/errors.middleware.js';
import { type Category } from '@prisma/client';

const debug = createDebug('FP*:controller');

export class ProjectController extends BaseController<Project, ProjectDto> {
  constructor(protected readonly repo: ProjectRepository) {
    debug('instantiated project controller');
    super(repo);
  }

  async filterByCategory(req: Request, res: Response, next: NextFunction) {
    const { category } = req.params;

    try {
      const project = await this.repo.searchForCategory(
        'category',
        category as Category
      );
      res.status(202);
      res.json(project);
    } catch (error) {
      next(new HttpError(404, 'Bad request', 'Category not found'));
    }
  }
}
