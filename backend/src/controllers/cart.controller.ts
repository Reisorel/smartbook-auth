import { Request, Response, NextFunction } from 'express';
import { Cart, Book } from '../models/index.model';
import { ApiError } from '../middlewares/error.middleware';
import Logger from '../utils/logger.utils';

/**
 * Récupère le panier de l'utilisateur connecté
 */
export const getCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Utilisateur non authentifié');
    }

    let cart = await Cart.findOne({ userId: req.user.userId }).populate('items.bookId');

    // Si l'utilisateur n'a pas encore de panier, en créer un
    if (!cart) {
      cart = await Cart.create({ userId: req.user.userId, items: [] });
    }

    res.json(cart);
  } catch (error) {
    next(error);
  }
};

/**
 * Ajoute un livre au panier
 */
export const addItemToCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Utilisateur non authentifié');
    }

    const { bookId, quantity } = req.body;

    // Validation des entrées
    if (!bookId) {
      throw new ApiError(400, 'Identifiant du livre requis');
    }

    if (!quantity || isNaN(quantity) || quantity <= 0) {
      throw new ApiError(400, 'La quantité doit être un nombre positif');
    }

    // Vérifier si le livre existe
    const book = await Book.findById(bookId);
    if (!book) {
      throw new ApiError(404, 'Livre non trouvé');
    }

    // Vérifier le stock disponible
    if (book.stock < quantity) {
      throw new ApiError(400, 'Stock insuffisant');
    }

    // Rechercher ou créer le panier de l'utilisateur
    let cart = await Cart.findOne({ userId: req.user.userId });
    if (!cart) {
      cart = await Cart.create({
        userId: req.user.userId,
        items: []
      });
    }

    // Vérifier si le livre est déjà dans le panier
    const itemIndex = cart.items.findIndex(item => item.bookId.toString() === bookId);

    if (itemIndex > -1) {
      // Mise à jour de la quantité si le livre est déjà dans le panier
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Ajouter un nouvel élément au panier
      cart.items.push({
        bookId,
        quantity
      });
    }

    // Sauvegarder les modifications
    await cart.save();

    res.json({
      message: 'Article ajouté au panier',
      cart
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Met à jour la quantité d'un article dans le panier
 */
export const updateCartItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Utilisateur non authentifié');
    }

    const { bookId } = req.params;
    const { quantity } = req.body;

    // Vérifier si la quantité est valide
    if (quantity <= 0) {
      throw new ApiError(400, 'La quantité doit être positive');
    }

    // Vérifier si le livre existe et si le stock est suffisant
    const book = await Book.findById(bookId);
    if (!book) {
      throw new ApiError(404, 'Livre non trouvé');
    }

    if (book.stock < quantity) {
      throw new ApiError(400, 'Stock insuffisant');
    }

    // Trouver le panier de l'utilisateur
    const cart = await Cart.findOne({ userId: req.user.userId });
    if (!cart) {
      throw new ApiError(404, 'Panier non trouvé');
    }

    // Trouver l'article dans le panier
    const itemIndex = cart.items.findIndex(item => item.bookId.toString() === bookId);
    if (itemIndex === -1) {
      throw new ApiError(404, 'Article non trouvé dans le panier');
    }

    // Mettre à jour la quantité
    cart.items[itemIndex].quantity = quantity;

    // Sauvegarder les modifications
    await cart.save();

    // Récupérer le panier avec les détails des livres
    const populatedCart = await Cart.findById(cart._id).populate('items.bookId');

    res.json({
      message: 'Quantité mise à jour',
      cart: populatedCart
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Supprime un article du panier
 */
export const removeCartItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Utilisateur non authentifié');
    }

    const { bookId } = req.params;

    // Trouver le panier de l'utilisateur
    const cart = await Cart.findOne({ userId: req.user.userId });
    if (!cart) {
      throw new ApiError(404, 'Panier non trouvé');
    }

    // Filtrer l'article à supprimer
    cart.items = cart.items.filter(item => item.bookId.toString() !== bookId);

    // Sauvegarder les modifications
    await cart.save();

    res.json({
      message: 'Article supprimé du panier',
      cart
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Vide complètement le panier
 */
export const clearCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Utilisateur non authentifié');
    }

    // Trouver le panier de l'utilisateur
    const cart = await Cart.findOne({ userId: req.user.userId });
    if (!cart) {
      throw new ApiError(404, 'Panier non trouvé');
    }

    // Vider le panier
    cart.items = [];

    // Sauvegarder les modifications
    await cart.save();

    res.json({
      message: 'Panier vidé avec succès',
      cart
    });
  } catch (error) {
    next(error);
  }
};
