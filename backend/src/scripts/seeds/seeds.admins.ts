import { User } from '../../models/index.model';
import { hashPassword } from '../../utils/password.utils';
import Logger from '../../utils/logger.utils';

export async function seedAdmin(): Promise<void> {
  try {
    // Vérifier si un admin existe déjà
    const adminExists = await User.findOne({ role: 'admin' });

    if (!adminExists) {
      // Configuration des données admin
      const adminData = {
        name: 'Admin',
        email: 'admin@smartbookshop.com',
        password: 'AdminPass123!',
        role: 'admin'
      };

      // Hasher le mot de passe
      const passwordHash = await hashPassword(adminData.password);

      // Créer l'admin
      const admin = await User.create({
        name: adminData.name,
        email: adminData.email,
        passwordHash,
        role: adminData.role
      });

      Logger.info('👑 Compte administrateur créé:', { email: admin.email });
    } else {
      Logger.info('👑 Un compte administrateur existe déjà');
    }
  } catch (error) {
    Logger.error('❌ Erreur lors de la création de l\'admin:', error as Error);
    throw error;
  }
}
