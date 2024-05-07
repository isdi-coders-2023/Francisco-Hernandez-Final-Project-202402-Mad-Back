import { type NextFunction, type Request, type Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import createDebug from 'debug';
import multer from 'multer';
import { HttpError } from '../errors.middleware/errors.middleware.js';
const debug = createDebug('TFD:files:interceptor');

export class FilesMiddleware {
  constructor() {
    debug('Instantiated files interceptor');
  }

  uploadFile(fieldName = 'archive') {
    debug('Creating file middleware');
    const storage = multer.diskStorage({
      destination: 'uploads/',
      filename(_req, file, callback) {
        callback(null, Date.now() + '_' + file.originalname);
      },
    });

    const upload = multer({ storage });
    const middleware = upload.single(fieldName);

    return (req: Request, res: Response, next: NextFunction) => {
      debug('Uploading file');
      const previousBody = req.body as Record<string, unknown>;
      req.body = { ...previousBody, ...req.body } as unknown;
      middleware(req, res, next);
    };
  }

  async cloudinaryUpload(req: Request, _res: Response, next: NextFunction) {
    debug('Uploading file to cloudinary');
    const options = {
      folder: 'canline',
      useFilename: true,
      uniqueFilename: false,
      overwrite: true,
    };

    if (!req.file) {
      next(new HttpError(400, 'Bad request', 'No file uploaded'));
      return;
    }

    const finalPath = req.file.destination + '/' + req.file.filename;

    try {
      const result = await cloudinary.uploader.upload(finalPath, options);
      req.body.archive = result.secure_url;
      next();
    } catch (error) {
      next(
        new HttpError(500, 'Internal server error', (error as Error).message)
      );
    }
  }
}
