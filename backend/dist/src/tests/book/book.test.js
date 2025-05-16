"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../app"));
const test_utils_1 = require("../utils/test-utils");
describe('Book Controller', () => {
    let adminToken;
    let clientToken;
    let bookId;
    beforeEach(async () => {
        await (0, test_utils_1.clearTestData)();
        // Créer un administrateur et un client pour les tests
        const adminData = await (0, test_utils_1.createTestUser)('admin');
        adminToken = adminData.token;
        const clientData = await (0, test_utils_1.createTestUser)('client');
        clientToken = clientData.token;
        // Créer un livre de test
        const book = await (0, test_utils_1.createTestBook)();
        bookId = book._id.toString();
    });
    describe('GET /api/books', () => {
        it('devrait récupérer tous les livres', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .get('/api/books');
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body).toHaveLength(1);
            expect(response.body[0].title).toContain('Test Book');
        });
    });
    describe('GET /api/books/:id', () => {
        it('devrait récupérer un livre par son ID', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .get(`/api/books/${bookId}`);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('_id', bookId);
            expect(response.body).toHaveProperty('title');
            expect(response.body).toHaveProperty('author', 'Test Author');
        });
        it('devrait retourner une erreur si le livre n\'existe pas', async () => {
            const fakeId = '5f7d5f3ed1f2f43cbc400000';
            const response = await (0, supertest_1.default)(app_1.default)
                .get(`/api/books/${fakeId}`);
            expect(response.status).toBe(404);
        });
    });
    describe('POST /api/books', () => {
        it('devrait créer un nouveau livre (admin)', async () => {
            const newBook = {
                title: 'Nouveau Livre',
                author: 'Auteur Test',
                price: 12.99,
                stock: 20,
                description: 'Description du livre de test'
            };
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/books')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(newBook);
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('book');
            expect(response.body.book.title).toBe(newBook.title);
        });
        it('devrait refuser la création d\'un livre par un client', async () => {
            const newBook = {
                title: 'Livre client',
                author: 'Client',
                price: 9.99,
                stock: 5
            };
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/books')
                .set('Authorization', `Bearer ${clientToken}`)
                .send(newBook);
            expect(response.status).toBe(403);
        });
    });
    describe('PUT /api/books/:id', () => {
        it('devrait mettre à jour un livre (admin)', async () => {
            const updates = {
                title: 'Titre mis à jour',
                price: 14.99
            };
            const response = await (0, supertest_1.default)(app_1.default)
                .put(`/api/books/${bookId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send(updates);
            expect(response.status).toBe(200);
            expect(response.body.book.title).toBe(updates.title);
            expect(response.body.book.price).toBe(updates.price);
        });
        it('devrait refuser la mise à jour par un client', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .put(`/api/books/${bookId}`)
                .set('Authorization', `Bearer ${clientToken}`)
                .send({ price: 19.99 });
            expect(response.status).toBe(403);
        });
    });
    describe('DELETE /api/books/:id', () => {
        it('devrait supprimer un livre (admin)', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .delete(`/api/books/${bookId}`)
                .set('Authorization', `Bearer ${adminToken}`);
            expect(response.status).toBe(200);
            // Vérifier que le livre a été supprimé
            const checkResponse = await (0, supertest_1.default)(app_1.default)
                .get(`/api/books/${bookId}`);
            expect(checkResponse.status).toBe(404);
        });
        it('devrait refuser la suppression par un client', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .delete(`/api/books/${bookId}`)
                .set('Authorization', `Bearer ${clientToken}`);
            expect(response.status).toBe(403);
        });
    });
});
