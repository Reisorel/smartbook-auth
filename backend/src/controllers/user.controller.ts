import { Request, Response, NextFunction } from 'express';
import { User } from '../models/index.model';
import { hashPassword } from '../utils/password.utils';
import { ApiError } from '../middlewares/error.middleware';
import Logger from '../utils/logger.utils';

/**
 * Récupérer le profil de l'utilisateur connecté
 */
export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Utilisateur non authentifié');
    }

    const user = await User.findById(req.user.userId).select('-passwordHash');

    if (!user) {
      throw new ApiError(404, 'Utilisateur non trouvé');
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * Mettre à jour le profil de l'utilisateur connecté
 */
export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Utilisateur non authentifié');
    }

    const { name, email, password } = req.body;

    // Vérifier si un autre utilisateur utilise déjà cet email
    if (email) {
      const emailExists = await User.findOne({ email, _id: { $ne: req.user.userId } });
      if (emailExists) {
        throw new ApiError(409, 'Cet email est déjà utilisé par un autre compte');
      }
    }

    // Préparer les données à mettre à jour
    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) updateData.passwordHash = await hashPassword(password);

    // Mettre à jour l'utilisateur
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-passwordHash');

    if (!user) {
      throw new ApiError(404, 'Utilisateur non trouvé');
    }

    Logger.info(`Utilisateur mis à jour: ${user._id}`);

    res.json({
      message: 'Profil mis à jour avec succès',
      user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Supprimer le compte de l'utilisateur connecté
 */
export const deleteProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Utilisateur non authentifié');
    }

    const user = await User.findByIdAndDelete(req.user.userId);

    if (!user) {
      throw new ApiError(404, 'Utilisateur non trouvé');
    }

    Logger.info(`Utilisateur supprimé: ${user._id}`);

    res.json({
      message: 'Compte supprimé avec succès'
    });
  } catch (error) {
    next(error);
  }
};

// Fonctions réservées aux administrateurs

/**
 * Récupérer tous les utilisateurs (admin uniquement)
 */
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find().select('-passwordHash');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer un utilisateur par son ID (admin uniquement)
 */
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');

    if (!user) {
      throw new ApiError(404, 'Utilisateur non trouvé');
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * Mettre à jour un utilisateur (admin uniquement)
 */
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, role, password } = req.body;

    // Vérifier si un autre utilisateur utilise déjà cet email
    if (email) {
      const emailExists = await User.findOne({ email, _id: { $ne: req.params.id } });
      if (emailExists) {
        throw new ApiError(409, 'Cet email est déjà utilisé par un autre compte');
      }
    }

    // Préparer les données à mettre à jour
    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (password) updateData.passwordHash = await hashPassword(password);

    // Mettre à jour l'utilisateur
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-passwordHash');

    if (!user) {
      throw new ApiError(404, 'Utilisateur non trouvé');
    }

    Logger.info(`Utilisateur ${user._id} mis à jour par admin`);

    res.json({
      message: 'Utilisateur mis à jour avec succès',
      user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Supprimer un utilisateur (admin uniquement)
 */
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      throw new ApiError(404, 'Utilisateur non trouvé');
    }

    Logger.info(`Utilisateur ${user._id} supprimé par admin`);

    res.json({
      message: 'Utilisateur supprimé avec succès'
    });
  } catch (error) {
    next(error);
  }
};
