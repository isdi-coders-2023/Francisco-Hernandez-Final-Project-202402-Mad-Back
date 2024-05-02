import { type Request, type Response } from 'express';
import { BaseController } from './base.controller';

const mockRepo = {
  readAll: jest.fn(),
  readById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const controller = new BaseController(mockRepo);

describe('BaseController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all items', async () => {
      const mockRequest = {} as unknown as Request;
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;
      const mockNext = jest.fn();

      mockRepo.readAll.mockResolvedValueOnce(['item1', 'item2']);

      await controller.getAll(mockRequest, mockResponse, mockNext);

      expect(mockRepo.readAll).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(['item1', 'item2']);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next on error', async () => {
      const mockRequest = {} as unknown as Request;
      const mockResponse = {} as unknown as Response;
      const mockNext = jest.fn();

      mockRepo.readAll.mockRejectedValueOnce(
        new Error('Failed to fetch items')
      );

      await controller.getAll(mockRequest, mockResponse, mockNext);

      expect(mockRepo.readAll).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(new Error('Failed to fetch items'));
    });
  });

  describe('getById', () => {
    it('should return item by id', async () => {
      const mockRequest = { params: { id: '123' } } as unknown as Request;
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;
      const mockNext = jest.fn();

      mockRepo.readById.mockResolvedValueOnce({ id: '123', name: 'Item' });

      await controller.getById(mockRequest, mockResponse, mockNext);

      expect(mockRepo.readById).toHaveBeenCalledWith('123');
      expect(mockResponse.json).toHaveBeenCalledWith({
        id: '123',
        name: 'Item',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next on error', async () => {
      const mockRequest = { params: { id: '123' } } as unknown as Request;
      const mockResponse = {} as unknown as Response;
      const mockNext = jest.fn();

      mockRepo.readById.mockRejectedValueOnce(new Error('Item not found'));

      await controller.getById(mockRequest, mockResponse, mockNext);

      expect(mockRepo.readById).toHaveBeenCalledWith('123');
      expect(mockNext).toHaveBeenCalledWith(new Error('Item not found'));
    });
  });

  describe('create', () => {
    it('should create a new item', async () => {
      const mockRequest = { body: { name: 'New Item' } } as unknown as Request;
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const mockNext = jest.fn();

      mockRepo.create.mockResolvedValueOnce({ id: '456', name: 'New Item' });

      await controller.create(mockRequest, mockResponse, mockNext);

      expect(mockRepo.create).toHaveBeenCalledWith({ name: 'New Item' });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        id: '456',
        name: 'New Item',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next on error', async () => {
      const mockRequest = { body: { name: 'New Item' } } as unknown as Request;
      const mockResponse = {} as unknown as Response;
      const mockNext = jest.fn();

      mockRepo.create.mockRejectedValueOnce(new Error('Failed to create item'));

      await controller.create(mockRequest, mockResponse, mockNext);

      expect(mockRepo.create).toHaveBeenCalledWith({ name: 'New Item' });
      expect(mockNext).toHaveBeenCalledWith(new Error('Failed to create item'));
    });
  });
  describe('delete', () => {
    it('should return item by id', async () => {
      const mockRequest = { params: { id: '123' } } as unknown as Request;
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;
      const mockNext = jest.fn();

      mockRepo.delete.mockResolvedValueOnce({ id: '123', name: 'Item' });

      await controller.delete(mockRequest, mockResponse, mockNext);

      expect(mockRepo.delete).toHaveBeenCalledWith('123');
      expect(mockResponse.json).toHaveBeenCalledWith({
        id: '123',
        name: 'Item',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next on error', async () => {
      const mockRequest = { params: { id: '123' } } as unknown as Request;
      const mockResponse = {} as unknown as Response;
      const mockNext = jest.fn();

      mockRepo.delete.mockRejectedValueOnce(new Error('Item not found'));

      await controller.delete(mockRequest, mockResponse, mockNext);

      expect(mockRepo.delete).toHaveBeenCalledWith('123');
      expect(mockNext).toHaveBeenCalledWith(new Error('Item not found'));
    });
  });
});
