import mongoose from 'mongoose';
import { ENV } from '../config/env.config';
import { seedAdmin, seedClient, seedBooks } from './seeds/seeds.index';
import Logger from '../utils/logger.utils';

// Fonction pour initialiser la base de données
const seedDatabase = async () => {
  try {
    // Connexion à la base de données
    await mongoose.connect(ENV.MONGODB_URI);
    Logger.info('🔌 Connexion à MongoDB établie');

    // Exécuter les seeds
    await seedAdmin();
    await seedClient();
    await seedBooks();

    Logger.info('✅ Initialisation de la base de données terminée');
    process.exit(0);
  } catch (error) {
    Logger.error('❌ Erreur lors de l\'initialisation de la base de données:', error as Error);
    process.exit(1);
  }
};

// Exécuter le seed
seedDatabase();
