"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const index_model_1 = require("../models/index.model");
const password_utils_1 = require("../utils/password.utils");
const jwt_utils_1 = require("../utils/jwt.utils");
const error_middleware_1 = require("../middlewares/error.middleware");
const logger_utils_1 = __importDefault(require("../utils/logger.utils"));
/**
 * Inscription d'un nouvel utilisateur
 */
const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await index_model_1.User.findOne({ email });
        if (existingUser) {
            throw new error_middleware_1.ApiError(409, 'Cet email est déjà utilisé');
        }
        // Hasher le mot de passe
        const passwordHash = await (0, password_utils_1.hashPassword)(password);
        // Créer un nouvel utilisateur
        const userData = {
            name,
            email,
            passwordHash,
            role: 'client'
        };
        const newUser = await index_model_1.User.create(userData);
        // Générer un token JWT
        const token = (0, jwt_utils_1.generateToken)({
            userId: newUser._id.toString(),
            role: newUser.role
        });
        logger_utils_1.default.info(`Nouvel utilisateur inscrit: ${email}`);
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
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
/**
 * Connexion d'un utilisateur
 */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // Trouver l'utilisateur par email
        const user = await index_model_1.User.findOne({ email }).exec();
        if (!user) {
            throw new error_middleware_1.ApiError(401, 'Email ou mot de passe incorrect');
        }
        // Vérifier le mot de passe
        const isPasswordValid = await (0, password_utils_1.comparePassword)(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new error_middleware_1.ApiError(401, 'Email ou mot de passe incorrect');
        }
        // Générer un token JWT
        const token = (0, jwt_utils_1.generateToken)({
            userId: user._id.toString(),
            role: user.role
        });
        logger_utils_1.default.info(`Utilisateur connecté: ${email}`);
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
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
