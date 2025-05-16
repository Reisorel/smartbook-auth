"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBook = exports.updateBook = exports.createBook = exports.getBookById = exports.getAllBooks = void 0;
const index_model_1 = require("../models/index.model");
const error_middleware_1 = require("../middlewares/error.middleware");
const logger_utils_1 = __importDefault(require("../utils/logger.utils"));
/**
 * Récupérer tous les livres
 */
const getAllBooks = async (req, res, next) => {
    try {
        const books = await index_model_1.Book.find();
        res.json(books);
    }
    catch (error) {
        next(error);
    }
};
exports.getAllBooks = getAllBooks;
/**
 * Récupérer un livre par son ID
 */
const getBookById = async (req, res, next) => {
    try {
        const book = await index_model_1.Book.findById(req.params.id);
        if (!book) {
            throw new error_middleware_1.ApiError(404, 'Livre non trouvé');
        }
        res.json(book);
    }
    catch (error) {
        next(error);
    }
};
exports.getBookById = getBookById;
/**
 * Créer un nouveau livre (admin uniquement)
 */
const createBook = async (req, res, next) => {
    try {
        const { title, author, price, stock, coverUrl, description } = req.body;
        // Vérifier si le titre existe déjà
        const existingBook = await index_model_1.Book.findOne({ title });
        if (existingBook) {
            throw new error_middleware_1.ApiError(409, 'Un livre avec ce titre existe déjà');
        }
        const book = await index_model_1.Book.create({
            title,
            author,
            price,
            stock,
            coverUrl,
            description
        });
        logger_utils_1.default.info(`Nouveau livre créé: ${title} par ${author}`);
        res.status(201).json({
            message: 'Livre créé avec succès',
            book
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createBook = createBook;
/**
 * Mettre à jour un livre (admin uniquement)
 */
const updateBook = async (req, res, next) => {
    try {
        const { title, author, price, stock, coverUrl, description } = req.body;
        const book = await index_model_1.Book.findByIdAndUpdate(req.params.id, { title, author, price, stock, coverUrl, description }, { new: true, runValidators: true });
        if (!book) {
            throw new error_middleware_1.ApiError(404, 'Livre non trouvé');
        }
        logger_utils_1.default.info(`Livre mis à jour: ${book._id}`);
        res.json({
            message: 'Livre mis à jour avec succès',
            book
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateBook = updateBook;
/**
 * Supprimer un livre (admin uniquement)
 */
const deleteBook = async (req, res, next) => {
    try {
        const book = await index_model_1.Book.findByIdAndDelete(req.params.id);
        if (!book) {
            throw new error_middleware_1.ApiError(404, 'Livre non trouvé');
        }
        logger_utils_1.default.info(`Livre supprimé: ${book._id}`);
        res.json({
            message: 'Livre supprimé avec succès'
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteBook = deleteBook;
