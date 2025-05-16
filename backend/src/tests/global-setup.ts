import { MongoMemoryServer } from 'mongodb-memory-server';

export default async function globalSetup() {
  // Définir la variable d'environnement NODE_ENV à 'test'
  process.env.NODE_ENV = 'test';
  // Définir d'autres variables d'environnement spécifiques aux tests si nécessaire
  process.env.JWT_SECRET = 'test_secret_key';
  process.env.JWT_EXPIRES_IN = '1h';
}
