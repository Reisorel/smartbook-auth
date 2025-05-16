"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedBooks = seedBooks;
const index_model_1 = require("../../models/index.model");
const logger_utils_1 = __importDefault(require("../../utils/logger.utils"));
async function seedBooks() {
    try {
        // Configuration des données de livres
        const booksData = [
            {
                title: 'Le Petit Prince',
                author: 'Antoine de Saint-Exupéry',
                price: 9.99,
                stock: 50,
                coverUrl: 'https://example.com/petit-prince.jpg',
                description: 'Un classique de la littérature française'
            },
            {
                title: '1984',
                author: 'George Orwell',
                price: 12.99,
                stock: 30,
                coverUrl: 'https://example.com/1984.jpg',
                description: 'Un roman dystopique sur la surveillance de masse'
            },
            {
                title: 'Dune',
                author: 'Frank Herbert',
                price: 14.99,
                stock: 25,
                coverUrl: 'https://example.com/dune.jpg',
                description: 'Le chef-d\'œuvre de la science-fiction'
            },
            {
                title: 'Harry Potter à l\'école des sorciers',
                author: 'J.K. Rowling',
                price: 11.99,
                stock: 45,
                coverUrl: 'https://example.com/harry-potter.jpg',
                description: 'Le début de la célèbre saga de magie'
            },
            {
                title: 'L\'Étranger',
                author: 'Albert Camus',
                price: 8.99,
                stock: 20,
                coverUrl: 'https://example.com/etranger.jpg',
                description: 'Un roman existentialiste sur l\'absurdité de la vie'
            }
        ];
        // Vérifier si des livres existent déjà
        const booksCount = await index_model_1.Book.countDocuments();
        if (booksCount === 0) {
            // Créer les livres
            await index_model_1.Book.insertMany(booksData);
            logger_utils_1.default.info(`📚 ${booksData.length} livres ont été ajoutés`);
        }
        else {
            logger_utils_1.default.info(`📚 Des livres existent déjà (${booksCount} livres en base)`);
        }
    }
    catch (error) {
        logger_utils_1.default.error('❌ Erreur lors de la création des livres:', error);
        throw error;
    }
}
