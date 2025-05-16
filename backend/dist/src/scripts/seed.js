"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const env_config_1 = require("../config/env.config");
const seeds_index_1 = require("./seeds/seeds.index");
const logger_utils_1 = __importDefault(require("../utils/logger.utils"));
// Fonction pour initialiser la base de données
const seedDatabase = async () => {
    try {
        // Connexion à la base de données
        await mongoose_1.default.connect(env_config_1.ENV.MONGODB_URI);
        logger_utils_1.default.info('🔌 Connexion à MongoDB établie');
        // Exécuter les seeds
        await (0, seeds_index_1.seedAdmin)();
        await (0, seeds_index_1.seedClient)();
        await (0, seeds_index_1.seedBooks)();
        logger_utils_1.default.info('✅ Initialisation de la base de données terminée');
        process.exit(0);
    }
    catch (error) {
        logger_utils_1.default.error('❌ Erreur lors de l\'initialisation de la base de données:', error);
        process.exit(1);
    }
};
// Exécuter le seed
seedDatabase();
