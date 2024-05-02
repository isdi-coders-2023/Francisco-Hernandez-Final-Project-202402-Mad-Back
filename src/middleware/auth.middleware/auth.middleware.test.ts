import { type Repo } from '../../repositories/type.repo';
import { Auth } from '../../services/auth.services/auth.services';
import { HttpError } from '../errors.middleware/errors.middleware';
import { AuthMiddleware } from './auth.middleware';
import { type Request, type Response } from 'express';

describe('Given a instance of the class AuthMiddleware', () => {
  const middleware = new AuthMiddleware();
  Auth.verifyJwt = jest.fn().mockReturnValue({ id: '123' });

  test('Then it should be instance of the class', () => {
    expect(middleware).toBeInstanceOf(AuthMiddleware);
  });
  describe('When we use the method authentication', () => {
    const req = {
      body: {},
      get: jest.fn().mockReturnValue('Bearer myToken'),
    } as unknown as Request;
    const res = {} as unknown as Response;
    const next = jest.fn();

    test('Then it should call next with valid data', () => {
      middleware.authentication(req, res, next);
      expect(Auth.verifyJwt).toHaveBeenCalled();
      expect(req.body.payload).toEqual({ id: '123' });
      expect(next).toHaveBeenCalledWith();
    });

    describe('When we use the method authentication and token is MALFORMED', () => {
      test('Then it should call next with error', () => {
        req.get = jest.fn().mockReturnValue('myToken');
        middleware.authentication(req, res, next);
        expect(next).toHaveBeenLastCalledWith(
          new HttpError(498, ' Token expired/invalid', 'Token invalid')
        );
      });
    });
    describe('When we use the method authentication and token is INVALIDO', () => {
      test('Then it should call next with error', () => {
        req.get = jest.fn().mockReturnValue('Bearer myToken');
        // eslint-disable-next-line max-nested-callbacks
        Auth.verifyJwt = jest.fn().mockImplementation(() => {
          throw new Error('Invalid token');
        });
        middleware.authentication(req, res, next);
        expect(next).toHaveBeenCalledWith(new Error('Token invalid'));
      });
    });
  });

  describe('When we use the method isAdmin', () => {
    const req = {
      body: { payload: { role: 'admin' } },
    } as unknown as Request;
    const res = {} as unknown as Response;
    const next = jest.fn();

    describe('And user is NOT admin', () => {
      test('Then it should call next with error', () => {
        req.body.payload.role = 'user';
        middleware.isAdmin(req, res, next);
        expect(next).toHaveBeenCalledWith(
          new HttpError(
            403,
            'Forbidden',
            'You are not allowed to access this resource'
          )
        );
      });
    });
  });

  describe('When we use the method authorization', () => {
    const req = {
      body: { payload: { role: 'user' } },
      params: { id: '123' },
    } as unknown as Request;
    const res = {} as unknown as Response;
    const next = jest.fn();

    type T = { id: string };

    const repo: Repo<T, T> = {
      readById: jest.fn().mockResolvedValue({ id: '123' }),
    } as unknown as Repo<T, T>;

    test('Then it should call next', async () => {
      await middleware.authorization(repo)(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    describe('And user is admin', () => {
      test('Then it should call next', async () => {
        req.body = { payload: { role: 'admin' } };
        await middleware.authorization(repo)(req, res, next);
        expect(next).toHaveBeenCalled();
      });
    });

    describe('And user is NOT admin', () => {
      test('Then it should call next with error', async () => {
        req.body = { payload: { role: 'user' } };
        await middleware.authorization(repo)(req, res, next);
        expect(next).toHaveBeenCalledWith(
          new HttpError(
            403,
            'Forbidden',
            'You are not allowed to access this resource'
          )
        );
      });
    });

    describe('And user is NOT admin and id is different', () => {
      test('Then it should call next with error', async () => {
        req.body = { payload: { role: 'user', id: '456' } };
        await middleware.authorization(repo)(req, res, next);
        expect(next).toHaveBeenCalledWith(
          new HttpError(
            403,
            'Forbidden',
            'You are not allowed to access this resource'
          )
        );
      });
    });

    describe('And user is NOT admin and id is the same', () => {
      test('Then it should call next', async () => {
        req.body = { payload: { role: 'user', id: '123' } };
        await middleware.authorization(repo)(req, res, next);
        expect(next).toHaveBeenCalled();
      });
    });

    describe('And method have a second parameter', () => {
      test('Then it should call next', async () => {
        req.body = { payload: { role: 'user', id: '123' } };
        await middleware.authorization(repo, 'id')(req, res, next);
        expect(next).toHaveBeenCalled();
      });
    });

    describe('And fail repo readById', () => {
      test('Then it should call next with error', async () => {
        req.body = { payload: { role: 'user', id: '123' } };
        repo.readById = jest.fn().mockRejectedValue(new Error('Error'));
        await middleware.authorization(repo)(req, res, next);
        expect(next).toHaveBeenCalledWith(new Error('Error'));
      });
    });
  });
});
