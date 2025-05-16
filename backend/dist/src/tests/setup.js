"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
// Variable globale pour stocker l'instance de MongoDB Memory Server
let mongo;
// Fonction exécutée avant tous les tests
beforeAll(async () => {
    // Créer l'instance de MongoDB Memory Server
    mongo = await mongodb_memory_server_1.MongoMemoryServer.create();
    const uri = mongo.getUri();
    // Connexion à la base de données en mémoire
    await mongoose_1.default.connect(uri);
});
// Fonction exécutée après chaque test
afterEach(async () => {
    // Nettoyer toutes les collections pour avoir un état propre
    const collections = mongoose_1.default.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
});
// Fonction exécutée après tous les tests
afterAll(async () => {
    // Fermer la connexion à la base de données et arrêter le serveur MongoDB
    await mongoose_1.default.connection.close();
    await mongo.stop();
});
