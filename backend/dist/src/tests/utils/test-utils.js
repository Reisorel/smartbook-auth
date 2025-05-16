"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearTestData = exports.createTestCart = exports.createTestBook = exports.createTestUser = void 0;
const index_model_1 = require("../../models/index.model");
const password_utils_1 = require("../../utils/password.utils");
const jwt_utils_1 = require("../../utils/jwt.utils");
// Créer un utilisateur de test
const createTestUser = async (role = 'client') => {
    const passwordHash = await (0, password_utils_1.hashPassword)('Password123!');
    const user = await index_model_1.User.create({
        name: `Test ${role}`,
        email: `test-${role}@example.com`,
        passwordHash,
        role
    });
    const token = (0, jwt_utils_1.generateToken)({
        userId: user._id.toString(),
        role: user.role
    });
    return { user: user, token };
};
exports.createTestUser = createTestUser;
// Créer un livre de test
const createTestBook = async () => {
    const book = await index_model_1.Book.create({
        title: `Test Book ${Math.random().toString(36).substring(7)}`,
        author: 'Test Author',
        price: 9.99,
        stock: 10,
        description: 'A test book',
        coverUrl: 'https://example.com/test-book.jpg'
    });
    return book;
};
exports.createTestBook = createTestBook;
// Créer un panier de test
const createTestCart = async (userId, bookId) => {
    const cart = await index_model_1.Cart.create({
        userId,
        items: [{ bookId, quantity: 1 }]
    });
    return cart;
};
exports.createTestCart = createTestCart;
// Nettoyer la base de données de test
const clearTestData = async () => {
    await index_model_1.User.deleteMany({});
    await index_model_1.Book.deleteMany({});
    await index_model_1.Cart.deleteMany({});
};
exports.clearTestData = clearTestData;
