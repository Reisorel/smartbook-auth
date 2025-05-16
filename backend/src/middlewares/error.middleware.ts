import { Request, Response, NextFunction } from 'express';
import { ENV } from '../config/env.config';
import Logger from '../utils/logger.utils';

/**
 * Classe personnalisée pour les erreurs API
 */
export class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Middleware pour gérer les routes non trouvées (404)
 */
export const notFoundHandler = (req: Request, res: Response) => {
  Logger.warn(`Route non trouvée: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: 'Route non trouvée' });
};

/**
 * Middleware pour gérer les erreurs globales
 */
export const errorHandler = (err: Error | ApiError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err.message || 'Erreur interne du serveur';

  Logger.error(`Erreur ${statusCode}`, err, { path: req.originalUrl, method: req.method });

  res.status(statusCode).json({
    message,
    stack: ENV.NODE_ENV === 'development' ? err.stack : undefined
  });
};
