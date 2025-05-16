import app from './src/app';
import { connectDatabase } from './src/config/db.config';
import { ENV } from './src/config/env.config';

// Connexion à la base de données puis démarrage du serveur
const startServer = async (): Promise<void> => {
  try {
    // Connexion à MongoDB via la fonction dans db.config.ts
    await connectDatabase();

    // Démarrage du serveur Express
    app.listen(ENV.PORT, () => {
      console.log(`Serveur en mode ${ENV.NODE_ENV}`);
      console.log(`Serveur en écoute sur le port ${ENV.PORT}`);
      console.log(`Adresse de l'API: http://localhost:${ENV.PORT}`);

    });
  } catch (error) {
    console.error('Erreur au démarrage du serveur:', error);
    process.exit(1);
  }
};

// Lancement du serveur
startServer();
