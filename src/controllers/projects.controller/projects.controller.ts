import { BaseController } from '../base.controller.js';
import createDebug from 'debug';

import {
  type Project,
  type ProjectDto,
} from '../../entities/projects.entitty/projects.entity.js';
import { type ProjectRepository } from '../../repositories/projects.repository/project.repository.js';

const debug = createDebug('FP*:controller');

export class ProjectController extends BaseController<Project, ProjectDto> {
  constructor(protected readonly repo: ProjectRepository) {
    debug('instantiated project controller');
    super(repo);
  }
}
