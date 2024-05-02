import { type NextFunction, type Request, type Response } from 'express';
import { HttpError } from '../errors.middleware/errors.middleware.js';
import {
  Auth,
  type Payload,
} from '../../services/auth.services/auth.services.js';
import { type Repo } from '../../repositories/type.repo';

export class AuthMiddleware {
  authentication(req: Request, _res: Response, next: NextFunction) {
    const data = req.get('Authorization');

    if (!data?.startsWith('Bearer')) {
      next(new HttpError(498, ' Token expired/invalid', 'Token invalid'));
      return;
    }

    const token = data.slice(7);

    try {
      const payload = Auth.verifyJwt(token);
      req.body.payload = payload;
      next();
    } catch (error) {
      next(new HttpError(498, ' Token expired/invalid', 'Token invalid'));
    }
  }

  isAdmin(req: Request, _res: Response, next: NextFunction) {
    const { payload, role } = req.body as { payload: Payload; role: string };
    if (role !== 'admin') {
      next(
        new HttpError(
          403,
          'Forbidden',
          'You are not allowed to access this resource'
        )
      );
      return;
    }

    next();
  }

  authorization<T extends { id: string }>(
    repo: Repo<T, Partial<T>>,
    ownerKey?: keyof T
  ) {
    return async (req: Request, _res: Response, next: NextFunction) => {
      const { payload, ...rest } = req.body as { payload: Payload };
      req.body = rest;

      const { role } = payload;
      if (role === 'admin') {
        next();
        return;
      }

      try {
        const item: T = await repo.readById(req.params.id);

        const ownerId = ownerKey ? item[ownerKey] : item.id;

        if (payload.id !== ownerId) {
          next(
            new HttpError(
              403,
              'Forbidden',
              'You are not allowed to access this resource'
            )
          );
          return;
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }
}
