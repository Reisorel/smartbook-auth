import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

// Variable globale pour stocker l'instance de MongoDB Memory Server
let mongo: MongoMemoryServer;

// Fonction exécutée avant tous les tests
beforeAll(async () => {
  // Créer l'instance de MongoDB Memory Server
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();

  // Connexion à la base de données en mémoire
  await mongoose.connect(uri);
});

// Fonction exécutée après chaque test
afterEach(async () => {
  // Nettoyer toutes les collections pour avoir un état propre
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// Fonction exécutée après tous les tests
afterAll(async () => {
  // Fermer la connexion à la base de données et arrêter le serveur MongoDB
  await mongoose.connection.close();
  await mongo.stop();
});
