import { Request, Response, NextFunction } from 'express';
import { Book } from '../models/index.model';
import { ApiError } from '../middlewares/error.middleware';
import Logger from '../utils/logger.utils';

/**
 * Récupérer tous les livres
 */
export const getAllBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer un livre par son ID
 */
export const getBookById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      throw new ApiError(404, 'Livre non trouvé');
    }
    res.json(book);
  } catch (error) {
    next(error);
  }
};

/**
 * Créer un nouveau livre (admin uniquement)
 */
export const createBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, author, price, stock, coverUrl, description } = req.body;

    // Vérifier si le titre existe déjà
    const existingBook = await Book.findOne({ title });
    if (existingBook) {
      throw new ApiError(409, 'Un livre avec ce titre existe déjà');
    }

    const book = await Book.create({
      title,
      author,
      price,
      stock,
      coverUrl,
      description
    });

    Logger.info(`Nouveau livre créé: ${title} par ${author}`);

    res.status(201).json({
      message: 'Livre créé avec succès',
      book
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mettre à jour un livre (admin uniquement)
 */
export const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, author, price, stock, coverUrl, description } = req.body;

    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, price, stock, coverUrl, description },
      { new: true, runValidators: true }
    );

    if (!book) {
      throw new ApiError(404, 'Livre non trouvé');
    }

    Logger.info(`Livre mis à jour: ${book._id}`);

    res.json({
      message: 'Livre mis à jour avec succès',
      book
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Supprimer un livre (admin uniquement)
 */
export const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      throw new ApiError(404, 'Livre non trouvé');
    }

    Logger.info(`Livre supprimé: ${book._id}`);

    res.json({
      message: 'Livre supprimé avec succès'
    });
  } catch (error) {
    next(error);
  }
};
