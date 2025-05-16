"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_config_1 = require("../config/env.config");
/**
 * Génère un token JWT
 * @param payload Données à inclure dans le token
 * @returns Token JWT signé
 */
const generateToken = (payload) => {
    const secret = env_config_1.ENV.JWT_SECRET || 'fallback_secret_key';
    const options = {
        // Utiliser une assertion de type pour indiquer à TypeScript
        // que la valeur est compatible avec ce qu'attend SignOptions
        expiresIn: (env_config_1.ENV.JWT_EXPIRES_IN || '24h')
    };
    return jsonwebtoken_1.default.sign(payload, secret, options);
};
exports.generateToken = generateToken;
/**
 * Vérifie un token JWT
 * @param token Token JWT à vérifier
 * @returns Payload décodé ou erreur si invalide
 */
const verifyToken = (token) => {
    try {
        const secret = env_config_1.ENV.JWT_SECRET || 'fallback_secret_key';
        return jsonwebtoken_1.default.verify(token, secret);
    }
    catch (error) {
        throw new Error('Token invalide ou expiré');
    }
};
exports.verifyToken = verifyToken;
