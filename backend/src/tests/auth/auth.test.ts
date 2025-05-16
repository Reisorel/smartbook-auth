import request from 'supertest';
import app from '../../app';
import { clearTestData } from '../utils/test-utils';
import { User } from '../../models/index.model';
import { hashPassword } from '../../utils/password.utils';

describe('Auth Controller', () => {
  beforeEach(async () => {
    await clearTestData();
  });

  describe('POST /api/auth/register', () => {
    it('devrait créer un nouvel utilisateur', async () => {
      const response = await request(app)
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
      await User.create({
        name: 'Existing User',
        email: 'existing@example.com',
        passwordHash: 'hashedpassword',
        role: 'client'
      });

      // Tenter d'enregistrer un utilisateur avec le même email
      const response = await request(app)
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
      const hashedPassword = await hashPassword(password);

      const user = await User.create({
        name: 'Login User',
        email: 'login@example.com',
        passwordHash: hashedPassword,
        role: 'client'
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: password  // Utiliser le mot de passe en clair pour le test
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe('login@example.com');
    });

    it('devrait retourner une erreur si les identifiants sont incorrects', async () => {
      const response = await request(app)
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
