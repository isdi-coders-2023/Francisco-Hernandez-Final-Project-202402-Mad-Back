import { Router as createRouter } from 'express';
import { type FilesController } from '../../controllers/files.controller/files.controller';
import { type FilesMiddleware } from '../../middleware/files.middleware/files.middleware';

export class FilesRouter {
  router = createRouter();

  constructor(
    readonly controller: FilesController,
    readonly interceptor: FilesMiddleware
  ) {
    this.router.post(
      '/',
      interceptor.uploadFile('archivo').bind(interceptor),
      interceptor.cloudinaryUpload.bind(interceptor),
      controller.fileHandler.bind(controller)
    );
  }
}
