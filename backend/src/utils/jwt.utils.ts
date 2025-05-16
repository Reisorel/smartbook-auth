import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { ENV } from '../config/env.config';

export interface TokenPayload {
  userId: string;
  role: string;
}

/**
 * Génère un token JWT
 * @param payload Données à inclure dans le token
 * @returns Token JWT signé
 */
export const generateToken = (payload: TokenPayload): string => {
  const secret: Secret = ENV.JWT_SECRET || 'fallback_secret_key';
  const options: SignOptions = {
    // Utiliser une assertion de type pour indiquer à TypeScript
    // que la valeur est compatible avec ce qu'attend SignOptions
    expiresIn: (ENV.JWT_EXPIRES_IN || '24h') as jwt.SignOptions['expiresIn']
  };

  return jwt.sign(payload, secret, options);
};

/**
 * Vérifie un token JWT
 * @param token Token JWT à vérifier
 * @returns Payload décodé ou erreur si invalide
 */
export const verifyToken = (token: string): TokenPayload => {
  try {
    const secret: Secret = ENV.JWT_SECRET || 'fallback_secret_key';
    return jwt.verify(token, secret) as TokenPayload;
  } catch (error) {
    throw new Error('Token invalide ou expiré');
  }
};
