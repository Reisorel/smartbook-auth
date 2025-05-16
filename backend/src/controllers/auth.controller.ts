import { Request, Response, NextFunction } from 'express';
import { User, IUser } from '../models/index.model';
import { hashPassword, comparePassword } from '../utils/password.utils';
import { generateToken } from '../utils/jwt.utils';
import { ApiError } from '../middlewares/error.middleware';
import Logger from '../utils/logger.utils';
import mongoose from 'mongoose';

/**
 * Inscription d'un nouvel utilisateur
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(409, 'Cet email est déjà utilisé');
    }

    // Hasher le mot de passe
    const passwordHash = await hashPassword(password);

    // Créer un nouvel utilisateur
    const userData = {
      name,
      email,
      passwordHash,
      role: 'client' as const
    };

    const newUser = await User.create(userData);

    // Générer un token JWT
    const token = generateToken({
      userId: newUser._id.toString(),
      role: newUser.role
    });

    Logger.info(`Nouvel utilisateur inscrit: ${email}`);

    // Renvoyer les informations de l'utilisateur et le token
    res.status(201).json({
      message: 'Inscription réussie',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      },
      token
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Connexion d'un utilisateur
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Trouver l'utilisateur par email
    const user = await User.findOne({ email }).exec();

    if (!user) {
      throw new ApiError(401, 'Email ou mot de passe incorrect');
    }

    // Vérifier le mot de passe
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Email ou mot de passe incorrect');
    }

    // Générer un token JWT
    const token = generateToken({
      userId: user._id.toString(),
      role: user.role
    });

    Logger.info(`Utilisateur connecté: ${email}`);

    // Renvoyer les informations de l'utilisateur et le token
    res.json({
      message: 'Connexion réussie',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    next(error);
  }
};
