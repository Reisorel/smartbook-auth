"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAdmin = seedAdmin;
const index_model_1 = require("../../models/index.model");
const password_utils_1 = require("../../utils/password.utils");
const logger_utils_1 = __importDefault(require("../../utils/logger.utils"));
async function seedAdmin() {
    try {
        // Vérifier si un admin existe déjà
        const adminExists = await index_model_1.User.findOne({ role: 'admin' });
        if (!adminExists) {
            // Configuration des données admin
            const adminData = {
                name: 'Admin',
                email: 'admin@smartbookshop.com',
                password: 'AdminPass123!',
                role: 'admin'
            };
            // Hasher le mot de passe
            const passwordHash = await (0, password_utils_1.hashPassword)(adminData.password);
            // Créer l'admin
            const admin = await index_model_1.User.create({
                name: adminData.name,
                email: adminData.email,
                passwordHash,
                role: adminData.role
            });
            logger_utils_1.default.info('👑 Compte administrateur créé:', { email: admin.email });
        }
        else {
            logger_utils_1.default.info('👑 Un compte administrateur existe déjà');
        }
    }
    catch (error) {
        logger_utils_1.default.error('❌ Erreur lors de la création de l\'admin:', error);
        throw error;
    }
}
