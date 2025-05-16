"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFoundHandler = exports.ApiError = void 0;
const env_config_1 = require("../config/env.config");
const logger_utils_1 = __importDefault(require("../utils/logger.utils"));
/**
 * Classe personnalisée pour les erreurs API
 */
class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ApiError = ApiError;
/**
 * Middleware pour gérer les routes non trouvées (404)
 */
const notFoundHandler = (req, res) => {
    logger_utils_1.default.warn(`Route non trouvée: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ message: 'Route non trouvée' });
};
exports.notFoundHandler = notFoundHandler;
/**
 * Middleware pour gérer les erreurs globales
 */
const errorHandler = (err, req, res, next) => {
    const statusCode = err instanceof ApiError ? err.statusCode : 500;
    const message = err.message || 'Erreur interne du serveur';
    logger_utils_1.default.error(`Erreur ${statusCode}`, err, { path: req.originalUrl, method: req.method });
    res.status(statusCode).json({
        message,
        stack: env_config_1.ENV.NODE_ENV === 'development' ? err.stack : undefined
    });
};
exports.errorHandler = errorHandler;
