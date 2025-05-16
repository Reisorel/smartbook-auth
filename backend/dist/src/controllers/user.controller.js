"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserById = exports.getAllUsers = exports.deleteProfile = exports.updateProfile = exports.getProfile = void 0;
const index_model_1 = require("../models/index.model");
const password_utils_1 = require("../utils/password.utils");
const error_middleware_1 = require("../middlewares/error.middleware");
const logger_utils_1 = __importDefault(require("../utils/logger.utils"));
/**
 * Récupérer le profil de l'utilisateur connecté
 */
const getProfile = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new error_middleware_1.ApiError(401, 'Utilisateur non authentifié');
        }
        const user = await index_model_1.User.findById(req.user.userId).select('-passwordHash');
        if (!user) {
            throw new error_middleware_1.ApiError(404, 'Utilisateur non trouvé');
        }
        res.json(user);
    }
    catch (error) {
        next(error);
    }
};
exports.getProfile = getProfile;
/**
 * Mettre à jour le profil de l'utilisateur connecté
 */
const updateProfile = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new error_middleware_1.ApiError(401, 'Utilisateur non authentifié');
        }
        const { name, email, password } = req.body;
        // Vérifier si un autre utilisateur utilise déjà cet email
        if (email) {
            const emailExists = await index_model_1.User.findOne({ email, _id: { $ne: req.user.userId } });
            if (emailExists) {
                throw new error_middleware_1.ApiError(409, 'Cet email est déjà utilisé par un autre compte');
            }
        }
        // Préparer les données à mettre à jour
        const updateData = {};
        if (name)
            updateData.name = name;
        if (email)
            updateData.email = email;
        if (password)
            updateData.passwordHash = await (0, password_utils_1.hashPassword)(password);
        // Mettre à jour l'utilisateur
        const user = await index_model_1.User.findByIdAndUpdate(req.user.userId, updateData, { new: true, runValidators: true }).select('-passwordHash');
        if (!user) {
            throw new error_middleware_1.ApiError(404, 'Utilisateur non trouvé');
        }
        logger_utils_1.default.info(`Utilisateur mis à jour: ${user._id}`);
        res.json({
            message: 'Profil mis à jour avec succès',
            user
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateProfile = updateProfile;
/**
 * Supprimer le compte de l'utilisateur connecté
 */
const deleteProfile = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new error_middleware_1.ApiError(401, 'Utilisateur non authentifié');
        }
        const user = await index_model_1.User.findByIdAndDelete(req.user.userId);
        if (!user) {
            throw new error_middleware_1.ApiError(404, 'Utilisateur non trouvé');
        }
        logger_utils_1.default.info(`Utilisateur supprimé: ${user._id}`);
        res.json({
            message: 'Compte supprimé avec succès'
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteProfile = deleteProfile;
// Fonctions réservées aux administrateurs
/**
 * Récupérer tous les utilisateurs (admin uniquement)
 */
const getAllUsers = async (req, res, next) => {
    try {
        const users = await index_model_1.User.find().select('-passwordHash');
        res.json(users);
    }
    catch (error) {
        next(error);
    }
};
exports.getAllUsers = getAllUsers;
/**
 * Récupérer un utilisateur par son ID (admin uniquement)
 */
const getUserById = async (req, res, next) => {
    try {
        const user = await index_model_1.User.findById(req.params.id).select('-passwordHash');
        if (!user) {
            throw new error_middleware_1.ApiError(404, 'Utilisateur non trouvé');
        }
        res.json(user);
    }
    catch (error) {
        next(error);
    }
};
exports.getUserById = getUserById;
/**
 * Mettre à jour un utilisateur (admin uniquement)
 */
const updateUser = async (req, res, next) => {
    try {
        const { name, email, role, password } = req.body;
        // Vérifier si un autre utilisateur utilise déjà cet email
        if (email) {
            const emailExists = await index_model_1.User.findOne({ email, _id: { $ne: req.params.id } });
            if (emailExists) {
                throw new error_middleware_1.ApiError(409, 'Cet email est déjà utilisé par un autre compte');
            }
        }
        // Préparer les données à mettre à jour
        const updateData = {};
        if (name)
            updateData.name = name;
        if (email)
            updateData.email = email;
        if (role)
            updateData.role = role;
        if (password)
            updateData.passwordHash = await (0, password_utils_1.hashPassword)(password);
        // Mettre à jour l'utilisateur
        const user = await index_model_1.User.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true }).select('-passwordHash');
        if (!user) {
            throw new error_middleware_1.ApiError(404, 'Utilisateur non trouvé');
        }
        logger_utils_1.default.info(`Utilisateur ${user._id} mis à jour par admin`);
        res.json({
            message: 'Utilisateur mis à jour avec succès',
            user
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateUser = updateUser;
/**
 * Supprimer un utilisateur (admin uniquement)
 */
const deleteUser = async (req, res, next) => {
    try {
        const user = await index_model_1.User.findByIdAndDelete(req.params.id);
        if (!user) {
            throw new error_middleware_1.ApiError(404, 'Utilisateur non trouvé');
        }
        logger_utils_1.default.info(`Utilisateur ${user._id} supprimé par admin`);
        res.json({
            message: 'Utilisateur supprimé avec succès'
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteUser = deleteUser;
