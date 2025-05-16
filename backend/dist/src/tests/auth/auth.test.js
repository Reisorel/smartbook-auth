"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../app"));
const test_utils_1 = require("../utils/test-utils");
const index_model_1 = require("../../models/index.model");
const password_utils_1 = require("../../utils/password.utils");
describe('Auth Controller', () => {
    beforeEach(async () => {
        await (0, test_utils_1.clearTestData)();
    });
    describe('POST /api/auth/register', () => {
        it('devrait créer un nouvel utilisateur', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/auth/register')
                .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'Password123!'
            });
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('token');
            expect(response.body.user).toHaveProperty('id');
            expect(response.body.user.email).toBe('test@example.com');
            expect(response.body.user.role).toBe('client');
        });
        it('devrait retourner une erreur si l\'email existe déjà', async () => {
            // Créer un utilisateur
            await index_model_1.User.create({
                name: 'Existing User',
                email: 'existing@example.com',
                passwordHash: 'hashedpassword',
                role: 'client'
            });
            // Tenter d'enregistrer un utilisateur avec le même email
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/auth/register')
                .send({
                name: 'Test User',
                email: 'existing@example.com',
                password: 'Password123!'
            });
            expect(response.status).toBe(409);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toContain('déjà utilisé');
        });
    });
    describe('POST /api/auth/login', () => {
        it('devrait connecter un utilisateur existant', async () => {
            // Créer un utilisateur pour le test de connexion avec un hash correct
            const password = 'Password123!';
            const hashedPassword = await (0, password_utils_1.hashPassword)(password);
            const user = await index_model_1.User.create({
                name: 'Login User',
                email: 'login@example.com',
                passwordHash: hashedPassword,
                role: 'client'
            });
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/auth/login')
                .send({
                email: 'login@example.com',
                password: password // Utiliser le mot de passe en clair pour le test
            });
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
            expect(response.body.user).toHaveProperty('id');
            expect(response.body.user.email).toBe('login@example.com');
        });
        it('devrait retourner une erreur si les identifiants sont incorrects', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/auth/login')
                .send({
                email: 'nonexistent@example.com',
                password: 'WrongPassword123!'
            });
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toContain('incorrect');
        });
    });
});
