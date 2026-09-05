import { NextFunction, Request, Response } from 'express';

export const sendServerError = (res: Response, error: unknown, context: string) => {
  console.error(`[${context}]`, error);
  return res.status(500).json({ message: 'Erro interno do servidor.' });
};

export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`[unhandled ${req.method} ${req.originalUrl}]`, error);

  if (res.headersSent) {
    return next(error);
  }

  return res.status(500).json({ message: 'Erro interno do servidor.' });
};
