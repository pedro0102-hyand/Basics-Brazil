import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { mkdir, writeFile } from 'fs/promises';
import multer from 'multer';
import path from 'path';
import { fromBuffer } from 'file-type';

const uploadsDirectory = path.join(__dirname, '../../uploads');
const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (allowedMimeTypes.has(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Formato de imagem não suportado. Use JPEG, PNG ou WEBP.'));
  }
};

export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const avatarUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const storeVerifiedImage = (prefix: 'product' | 'avatar') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      return next();
    }

    try {
      const detectedType = await fromBuffer(req.file.buffer);

      if (!detectedType || !allowedMimeTypes.has(detectedType.mime)) {
        return res.status(400).json({
          message: 'Arquivo inválido. Envie uma imagem JPEG, PNG ou WEBP.',
        });
      }

      await mkdir(uploadsDirectory, { recursive: true });

      const filename = `${prefix}-${crypto.randomUUID()}.${detectedType.ext}`;
      await writeFile(path.join(uploadsDirectory, filename), req.file.buffer, { flag: 'wx' });

      Object.assign(req.file, { filename });
      return next();
    } catch (error) {
      return next(error);
    }
  };
};