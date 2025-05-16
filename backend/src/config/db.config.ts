import mongoose from 'mongoose';
import { ENV } from './env.config';

// Configuration de mongoose
mongoose.set('strictQuery', true);

// Fonction de connexion à la base de données
export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(ENV.MONGODB_URI as string);
    console.log('Connexion à MongoDB établie avec succès');
  } catch (error) {
    console.error('Erreur de connexion à MongoDB:', error);
    process.exit(1);
  }
};

// Gestionnaires d'événements de connexion
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB déconnecté');
});

mongoose.connection.on('error', (err) => {
  console.error('Erreur de connexion MongoDB:', err);
});

// Export de l'instance mongoose pour l'utiliser ailleurs si nécessaire
export default mongoose;
