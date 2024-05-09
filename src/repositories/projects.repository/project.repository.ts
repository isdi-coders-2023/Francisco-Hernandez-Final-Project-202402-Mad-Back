import { type Category, type PrismaClient } from '@prisma/client';
import { type Repo } from '../type.repo';
import createDebug from 'debug';
import {
  type ProjectUpdateDto,
  type Project,
  type ProjectCreateDto,
} from '../../entities/projects.entitty/projects.entity';
import { HttpError } from '../../middleware/errors.middleware/errors.middleware.js';
import { type Payload } from '../../services/auth.services/auth.services';

const debug = createDebug('FP*:repository');

const select = {
  id: true,
  title: true,
  content: true,
  archive: true,
  category: true,
  author: {
    select: {
      id: true,
      name: true,
      imageUrl: true,
      email: true,
    },
  },
};
export class ProjectRepository implements Repo<Project, ProjectCreateDto> {
  constructor(private readonly prisma: PrismaClient) {
    debug('instantiated project repository');
  }

  async readAll() {
    return this.prisma.project.findMany({
      select,
    });
  }

  async readById(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      select,
    });
    if (!project) {
      throw new HttpError(404, 'Not found', 'Project with this id not found');
    }

    return project;
  }

  async create(data: ProjectCreateDto & Payload) {
    const { payload, ...dto } = data;
    const newProject = await this.prisma.project.create({
      data: dto,
      select,
    });
    return newProject;
  }

  async update(id: string, data: Partial<ProjectCreateDto & Payload>) {
    const { payload, ...projectDto } = data;
    const project = await this.prisma.project.findUnique({
      where: { id },
    });
    if (!project) {
      throw new HttpError(404, 'Not found', 'Project with this id not found');
    }

    return this.prisma.project.update({
      where: { id },
      data: projectDto,
      select,
    });
  }

  async delete(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      select,
    });
    if (!project) {
      throw new HttpError(404, 'Not found', 'Project with this id not found');
    }

    return this.prisma.project.delete({
      where: { id },
      select,
    });
  }

  async searchForCategory(key: 'category', value: Category) {
    if (!'category'.includes(key)) {
      throw new HttpError(404, 'Not Found', 'Invalid query parameters');
    }

    const projectData = await this.prisma.project.findMany({
      where: { [key]: value },
      select: {
        id: true,
        title: true,
        content: true,
        category: true,
        archive: true,
      },
    });

    if (!projectData) {
      throw new HttpError(404, 'Not Found', `Invalid parameters`);
    }

    return projectData;
  }
}
