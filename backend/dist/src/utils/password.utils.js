"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
/**
 * Hash un mot de passe avec bcrypt
 */
const hashPassword = async (password) => {
    // Nombre d'itérations pour l'algorithme de hachage (2^10 = 1024) - équilibre entre sécurité et performance
    const saltRounds = 10;
    return bcrypt_1.default.hash(password, saltRounds);
};
exports.hashPassword = hashPassword;
/**
 * Compare un mot de passe en clair avec un hash
 */
const comparePassword = async (plainPassword, hashedPassword) => {
    return bcrypt_1.default.compare(plainPassword, hashedPassword);
};
exports.comparePassword = comparePassword;
