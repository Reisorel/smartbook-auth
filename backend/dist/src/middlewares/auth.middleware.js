"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.authenticate = void 0;
const jwt_utils_1 = require("../utils/jwt.utils");
const logger_utils_1 = __importDefault(require("../utils/logger.utils"));
/**
 * Middleware pour vérifier si l'utilisateur est authentifié
 */
const authenticate = (req, res, next) => {
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
        const decoded = (0, jwt_utils_1.verifyToken)(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        logger_utils_1.default.error('Erreur d\'authentification', error);
        res.status(401).json({ message: 'Token invalide ou expiré' });
    }
};
exports.authenticate = authenticate;
/**
 * Middleware pour vérifier si l'utilisateur est un administrateur
 */
const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        res.status(403).json({ message: 'Accès refusé - Permissions insuffisantes' });
        return;
    }
    next();
};
exports.isAdmin = isAdmin;
