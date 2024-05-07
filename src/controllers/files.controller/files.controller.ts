import { type NextFunction, type Request, type Response } from 'express';
import { HttpError } from '../../middleware/errors.middleware/errors.middleware';
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

export class FilesController {
  fileHandler(req: Request, res: Response, next: NextFunction) {
    if (!req.file) {
      next(new HttpError(400, 'Bad request', 'No file upload'));
      return;
    }

    res.json({
      message: 'File upload',
      field: req.file.fieldname,
      width: req.body.cloudinary.width,
      height: req.body.cloudinary.height,
      file: req.body.cloudinary.public_id,
      format: req.body.cloudinary.format,
      url: req.body.cloudinary.secure_url,
    });
  }
}
