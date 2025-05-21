"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCart = exports.removeCartItem = exports.updateCartItem = exports.addItemToCart = exports.getCart = void 0;
const index_model_1 = require("../models/index.model");
const error_middleware_1 = require("../middlewares/error.middleware");
/**
 * Récupère le panier de l'utilisateur connecté
 */
const getCart = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        // Récupérer le panier et peupler les références de livres
        const cart = await index_model_1.Cart.findOne({ userId })
            .populate('items.bookId')
            .exec();
        // Si pas de panier, renvoyer une réponse appropriée
        if (!cart) {
            res.status(404).json({
                message: "Aucun panier trouvé pour cet utilisateur",
                cart: null
            });
            return;
        }
        // Renvoyer le panier existant
        res.status(200).json(cart);
    }
    catch (error) {
        next(error);
    }
};
exports.getCart = getCart;
/**
 * Ajoute un livre au panier
 */
const addItemToCart = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new error_middleware_1.ApiError(401, 'Utilisateur non authentifié');
        }
        const { bookId, quantity } = req.body;
        // Validation des entrées
        if (!bookId) {
            throw new error_middleware_1.ApiError(400, 'Identifiant du livre requis');
        }
        if (!quantity || isNaN(quantity) || quantity <= 0) {
            throw new error_middleware_1.ApiError(400, 'La quantité doit être un nombre positif');
        }
        // Vérifier si le livre existe
        const book = await index_model_1.Book.findById(bookId);
        if (!book) {
            throw new error_middleware_1.ApiError(404, 'Livre non trouvé');
        }
        // Vérifier le stock disponible
        if (book.stock < quantity) {
            throw new error_middleware_1.ApiError(400, 'Stock insuffisant');
        }
        // Rechercher ou créer le panier de l'utilisateur
        let cart = await index_model_1.Cart.findOne({ userId: req.user.userId });
        if (!cart) {
            cart = await index_model_1.Cart.create({
                userId: req.user.userId,
                items: []
            });
        }
        // Vérifier si le livre est déjà dans le panier
        const itemIndex = cart.items.findIndex(item => item.bookId.toString() === bookId);
        if (itemIndex > -1) {
            // Mise à jour de la quantité si le livre est déjà dans le panier
            cart.items[itemIndex].quantity += quantity;
        }
        else {
            // Ajouter un nouvel élément au panier
            cart.items.push({
                bookId,
                quantity
            });
        }
        // Sauvegarder les modifications
        await cart.save();
        // Récupérer le panier avec les détails des livres
        const populatedCart = await index_model_1.Cart.findById(cart._id).populate('items.bookId');
        res.json({
            message: 'Article ajouté au panier',
            cart: populatedCart
        });
    }
    catch (error) {
        next(error);
    }
};
exports.addItemToCart = addItemToCart;
/**
 * Met à jour la quantité d'un article dans le panier
 */
const updateCartItem = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new error_middleware_1.ApiError(401, 'Utilisateur non authentifié');
        }
        const { bookId } = req.params;
        const { quantity } = req.body;
        // Vérifier si la quantité est valide
        if (quantity <= 0) {
            throw new error_middleware_1.ApiError(400, 'La quantité doit être positive');
        }
        // Vérifier si le livre existe et si le stock est suffisant
        const book = await index_model_1.Book.findById(bookId);
        if (!book) {
            throw new error_middleware_1.ApiError(404, 'Livre non trouvé');
        }
        if (book.stock < quantity) {
            throw new error_middleware_1.ApiError(400, 'Stock insuffisant');
        }
        // Trouver le panier de l'utilisateur
        const cart = await index_model_1.Cart.findOne({ userId: req.user.userId });
        if (!cart) {
            throw new error_middleware_1.ApiError(404, 'Panier non trouvé');
        }
        // Trouver l'article dans le panier
        const itemIndex = cart.items.findIndex(item => item.bookId.toString() === bookId);
        if (itemIndex === -1) {
            throw new error_middleware_1.ApiError(404, 'Article non trouvé dans le panier');
        }
        // Mettre à jour la quantité
        cart.items[itemIndex].quantity = quantity;
        // Sauvegarder les modifications
        await cart.save();
        // Récupérer le panier avec les détails des livres
        const populatedCart = await index_model_1.Cart.findById(cart._id).populate('items.bookId');
        res.json({
            message: 'Quantité mise à jour',
            cart: populatedCart
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateCartItem = updateCartItem;
/**
 * Supprime un article du panier
 */
const removeCartItem = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new error_middleware_1.ApiError(401, 'Utilisateur non authentifié');
        }
        const { bookId } = req.params;
        // Trouver le panier de l'utilisateur
        const cart = await index_model_1.Cart.findOne({ userId: req.user.userId });
        if (!cart) {
            throw new error_middleware_1.ApiError(404, 'Panier non trouvé');
        }
        // Filtrer l'article à supprimer
        cart.items = cart.items.filter(item => item.bookId.toString() !== bookId);
        // Sauvegarder les modifications
        await cart.save();
        res.json({
            message: 'Article supprimé du panier',
            cart
        });
    }
    catch (error) {
        next(error);
    }
};
exports.removeCartItem = removeCartItem;
/**
 * Vide complètement le panier
 */
const clearCart = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new error_middleware_1.ApiError(401, 'Utilisateur non authentifié');
        }
        // Trouver le panier de l'utilisateur
        const cart = await index_model_1.Cart.findOne({ userId: req.user.userId });
        if (!cart) {
            throw new error_middleware_1.ApiError(404, 'Panier non trouvé');
        }
        // Vider le panier
        cart.items = [];
        // Sauvegarder les modifications
        await cart.save();
        res.json({
            message: 'Panier vidé avec succès',
            cart
        });
    }
    catch (error) {
        next(error);
    }
};
exports.clearCart = clearCart;
