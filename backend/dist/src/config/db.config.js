"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_config_1 = require("./env.config");
// Configuration de mongoose
mongoose_1.default.set('strictQuery', true);
// Fonction de connexion à la base de données
const connectDatabase = async () => {
    try {
        await mongoose_1.default.connect(env_config_1.ENV.MONGODB_URI);
        console.log('Connexion à MongoDB établie avec succès');
    }
    catch (error) {
        console.error('Erreur de connexion à MongoDB:', error);
        process.exit(1);
    }
};
exports.connectDatabase = connectDatabase;
// Gestionnaires d'événements de connexion
mongoose_1.default.connection.on('disconnected', () => {
    console.log('MongoDB déconnecté');
});
mongoose_1.default.connection.on('error', (err) => {
    console.error('Erreur de connexion MongoDB:', err);
});
// Export de l'instance mongoose pour l'utiliser ailleurs si nécessaire
exports.default = mongoose_1.default;
