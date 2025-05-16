"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedClient = seedClient;
const index_model_1 = require("../../models/index.model");
const password_utils_1 = require("../../utils/password.utils");
const logger_utils_1 = __importDefault(require("../../utils/logger.utils"));
async function seedClient() {
    try {
        // Configuration des données du client
        const clientData = {
            name: 'Client Test',
            email: 'client@example.com',
            password: 'ClientPass123!',
            role: 'client'
        };
        // Vérifier si le client existe déjà
        const clientExists = await index_model_1.User.findOne({ email: clientData.email });
        if (!clientExists) {
            // Hasher le mot de passe
            const passwordHash = await (0, password_utils_1.hashPassword)(clientData.password);
            // Créer le client
            const client = await index_model_1.User.create({
                name: clientData.name,
                email: clientData.email,
                passwordHash,
                role: clientData.role
            });
            logger_utils_1.default.info('👤 Compte client créé:', { email: client.email });
        }
        else {
            logger_utils_1.default.info('👤 Le compte client existe déjà');
        }
    }
    catch (error) {
        logger_utils_1.default.error('❌ Erreur lors de la création du client:', error);
        throw error;
    }
}
