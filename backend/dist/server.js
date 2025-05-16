"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./src/app"));
const db_config_1 = require("./src/config/db.config");
const env_config_1 = require("./src/config/env.config");
// Connexion à la base de données puis démarrage du serveur
const startServer = async () => {
    try {
        // Connexion à MongoDB via la fonction dans db.config.ts
        await (0, db_config_1.connectDatabase)();
        // Démarrage du serveur Express
        app_1.default.listen(env_config_1.ENV.PORT, () => {
            console.log(`Serveur en mode ${env_config_1.ENV.NODE_ENV}`);
            console.log(`Serveur en écoute sur le port ${env_config_1.ENV.PORT}`);
            console.log(`Adresse de l'API: http://localhost:${env_config_1.ENV.PORT}`);
        });
    }
    catch (error) {
        console.error('Erreur au démarrage du serveur:', error);
        process.exit(1);
    }
};
// Lancement du serveur
startServer();
