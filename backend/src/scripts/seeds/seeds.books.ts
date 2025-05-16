import { Book } from '../../models/index.model';
import Logger from '../../utils/logger.utils';

export async function seedBooks(): Promise<void> {
  try {
    // Configuration des données de livres
    const booksData = [
      {
        title: 'Le Petit Prince',
        author: 'Antoine de Saint-Exupéry',
        price: 9.99,
        stock: 50,
        coverUrl: 'https://example.com/petit-prince.jpg',
        description: 'Un classique de la littérature française'
      },
      {
        title: '1984',
        author: 'George Orwell',
        price: 12.99,
        stock: 30,
        coverUrl: 'https://example.com/1984.jpg',
        description: 'Un roman dystopique sur la surveillance de masse'
      },
      {
        title: 'Dune',
        author: 'Frank Herbert',
        price: 14.99,
        stock: 25,
        coverUrl: 'https://example.com/dune.jpg',
        description: 'Le chef-d\'œuvre de la science-fiction'
      },
      {
        title: 'Harry Potter à l\'école des sorciers',
        author: 'J.K. Rowling',
        price: 11.99,
        stock: 45,
        coverUrl: 'https://example.com/harry-potter.jpg',
        description: 'Le début de la célèbre saga de magie'
      },
      {
        title: 'L\'Étranger',
        author: 'Albert Camus',
        price: 8.99,
        stock: 20,
        coverUrl: 'https://example.com/etranger.jpg',
        description: 'Un roman existentialiste sur l\'absurdité de la vie'
      }
    ];

    // Vérifier si des livres existent déjà
    const booksCount = await Book.countDocuments();

    if (booksCount === 0) {
      // Créer les livres
      await Book.insertMany(booksData);
      Logger.info(`📚 ${booksData.length} livres ont été ajoutés`);
    } else {
      Logger.info(`📚 Des livres existent déjà (${booksCount} livres en base)`);
    }
  } catch (error) {
    Logger.error('❌ Erreur lors de la création des livres:', error as Error);
    throw error;
  }
}
