import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt.utils';
import Logger from '../utils/logger.utils';

// Extension de l'interface Request pour inclure l'utilisateur
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

/**
 * Middleware pour vérifier si l'utilisateur est authentifié
 */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // 1. Extraire l'en-tête d'autorisation
    const authHeader = req.headers.authorization;
    // 2. Vérifier si l'en-tête est présent et commence par "Bearer "
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Authentification requise' });
      return;
    }
    // 3. Extraire le token (supprime "Bearer" au début)
    const token = authHeader.split(' ')[1];
    // 4. Vérifier et décoder le token
    const decoded = verifyToken(token);

    req.user = decoded;
    next();
  } catch (error) {
    Logger.error('Erreur d\'authentification', error as Error);
    res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};

/**
 * Middleware pour vérifier si l'utilisateur est un administrateur
 */
export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ message: 'Accès refusé - Permissions insuffisantes' });
    return;
  }
  next();
};
