import { User } from '../../models/index.model';
import { hashPassword } from '../../utils/password.utils';
import Logger from '../../utils/logger.utils';

export async function seedClient(): Promise<void> {
  try {
    // Configuration des données du client
    const clientData = {
      name: 'Client Test',
      email: 'client@example.com',
      password: 'ClientPass123!',
      role: 'client'
    };

    // Vérifier si le client existe déjà
    const clientExists = await User.findOne({ email: clientData.email });

    if (!clientExists) {
      // Hasher le mot de passe
      const passwordHash = await hashPassword(clientData.password);

      // Créer le client
      const client = await User.create({
        name: clientData.name,
        email: clientData.email,
        passwordHash,
        role: clientData.role
      });

      Logger.info('👤 Compte client créé:', { email: client.email });
    } else {
      Logger.info('👤 Le compte client existe déjà');
    }
  } catch (error) {
    Logger.error('❌ Erreur lors de la création du client:', error as Error);
    throw error;
  }
}
