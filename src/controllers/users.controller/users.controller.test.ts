import { HttpError } from '../../middleware/errors.middleware/errors.middleware';
import { type UserRepository } from '../../repositories/users.repository/user.respository';
import { Auth } from '../../services/auth.services/auth.services';
import { UserController } from './users.controller';
import { type Request, type Response } from 'express';

const mockRepo = {
  searchForLogin: jest.fn(),
  create: jest.fn(),
} as unknown as UserRepository;

const controller = new UserController(mockRepo);

describe('UserController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      const mockRequest = {
        body: { email: 'test@example.com', password: 'password123' },
      } as unknown as Request;
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const mockNext = jest.fn();

      const mockUser = {
        email: 'test@example.com',
        password: await Auth.hash('password123'),
      };
      Auth.compare = jest.fn().mockResolvedValueOnce(true);
      Auth.signJwt = jest.fn().mockReturnValueOnce('mockToken');

      await controller.login(mockRequest, mockResponse, mockNext);

      expect(mockRepo.searchForLogin).toHaveBeenCalledWith(
        'email',
        'test@example.com'
      );
    });

    it('should return 401 on invalid credentials', async () => {
      const mockRequest = {
        body: { email: 'test@example.com', password: 'password123' },
      } as unknown as Request;
      const mockResponse = {} as unknown as Response;
      const mockNext = jest.fn();

      await controller.login(mockRequest, mockResponse, mockNext);

      expect(mockRepo.searchForLogin).toHaveBeenCalledWith(
        'email',
        'test@example.com'
      );
      expect(mockNext).toHaveBeenCalledWith(
        new HttpError(401, 'Unauthorized', 'Email and password invalid')
      );
    });

    it('should return 400 on missing credentials', async () => {
      const mockRequest = {
        body: { email: '', password: '' },
      } as unknown as Request;
      const mockResponse = {} as unknown as Response;
      const mockNext = jest.fn();

      await controller.login(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        new HttpError(
          400,
          'Bad Request',
          'Email/name and password are required'
        )
      );
    });
  });
});
