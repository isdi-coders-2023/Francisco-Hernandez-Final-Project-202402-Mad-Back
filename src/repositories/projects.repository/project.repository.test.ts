import { type PrismaClient } from '@prisma/client';
import { type ProjectDto } from '../../entities/projects.entitty/projects.entity';
import { HttpError } from '../../middleware/errors.middleware/errors.middleware';
import { ProjectRepository } from './project.repository';

const mockPrisma = {
  project: {
    findMany: jest.fn().mockResolvedValue([]),
    findUnique: jest.fn().mockResolvedValue({ id: '1' }),
    create: jest.fn().mockResolvedValue({}),
    update: jest.fn().mockResolvedValue({}),
    delete: jest.fn().mockResolvedValue({}),
  },
} as unknown as PrismaClient;

describe('Given a instance of the class UserRepository', () => {
  const repo = new ProjectRepository(mockPrisma);

  test('Then it should be instance of the class', () => {
    expect(repo).toBeInstanceOf(ProjectRepository);
  });

  describe('When we use the method readAll', () => {
    test('Then it should call prisma.findMany', async () => {
      const result = await repo.readAll();
      expect(mockPrisma.project.findMany).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('When we use the method readById with a valid ID', () => {
    test('Then it should call prisma.findUnique', async () => {
      const result = await repo.readById('1');
      expect(mockPrisma.project.findUnique).toHaveBeenCalled();
      expect(result).toEqual({ id: '1' });
    });
  });

  describe('When we use the method readById with an invalid ID', () => {
    test('Then it should throw an error', async () => {
      (mockPrisma.project.findUnique as jest.Mock).mockResolvedValueOnce(null);
      await expect(repo.readById('2')).rejects.toThrow(
        new HttpError(404, 'Not Found', 'Project with this id not found')
      );
    });
  });

  describe('When we use the method create', () => {
    test('Then it should call prisma.create', async () => {
      const data = {} as unknown as ProjectDto;
      const result = await repo.create(data);
      expect(mockPrisma.project.create).toHaveBeenCalled();
      expect(result).toEqual({});
    });
  });

  describe('When we use the method update with a valid ID', () => {
    test('Then it should call prisma.update', async () => {
      const result = await repo.update('1', {
        title: 'fran',
        content: 'contenido',
        archive: 'archivo',
        category: 'law',
        authorId: '1',
      });
      expect(mockPrisma.project.update).toHaveBeenCalled();
      expect(result).toEqual({});
    });
  });

  describe('When we use the method update with an invalid ID', () => {
    test('Then it should throw an error', async () => {
      (mockPrisma.project.findUnique as jest.Mock).mockResolvedValueOnce(null);
      await expect(
        repo.update('2', {
          title: 'fran',
          content: 'contenido',
          archive: 'archivo',
          category: 'law',
          authorId: '1',
        })
      ).rejects.toThrow(
        new HttpError(404, 'Not Found', 'Project with this id not found')
      );
    });
  });

  describe('When we use the method delete with a valid ID', () => {
    test('Then it should call prisma.delete', async () => {
      const result = await repo.delete('1');
      expect(mockPrisma.project.delete).toHaveBeenCalled();
      expect(result).toEqual({});
    });
  });

  describe('When we use the method delete with an invalid ID', () => {
    test('Then it should throw an error', async () => {
      (mockPrisma.project.findUnique as jest.Mock).mockResolvedValueOnce(null);
      await expect(repo.delete('2')).rejects.toThrow(
        new HttpError(404, 'Not Found', 'Project with this id not found')
      );
    });
  });
});
