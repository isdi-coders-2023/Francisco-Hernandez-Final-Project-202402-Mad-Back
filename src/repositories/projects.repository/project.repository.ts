import { type PrismaClient } from '@prisma/client';
import { type Repo } from '../type.repo';
import createDebug from 'debug';
import {
  type Project,
  type ProjectDto,
} from '../../entities/projects.entitty/projects.entity';
import { HttpError } from '../../middleware/errors.middleware/errors.middleware.js';

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
export class ProjectRepository implements Repo<Project, ProjectDto> {
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

  async create(data: ProjectDto) {
    const newProject = await this.prisma.project.create({
      data,
      select,
    });
    return newProject;
  }

  async update(id: string, data: ProjectDto) {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });
    if (!project) {
      throw new HttpError(404, 'Not found', 'Project with this id not found');
    }

    return this.prisma.project.update({
      where: { id },
      data,
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
}