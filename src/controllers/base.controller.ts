import { type Repo } from '../repositories/type.repo';
import { type NextFunction, type Request, type Response } from 'express';
import { type Payload } from '../services/auth.services/auth.services';

export class BaseController<T, C> {
  constructor(protected readonly repo: Repo<T, C>) {}
  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.repo.readAll();
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const result = await this.repo.readById(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const data = req.body as C & Payload;
    try {
      const result = await this.repo.create(data);
      res.status(201);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const data = req.body as C;
    try {
      const result = await this.repo.update(id, data);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const result = await this.repo.delete(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
