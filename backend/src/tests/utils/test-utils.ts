import mongoose from 'mongoose';
import { User, Book, Cart } from '../../models/index.model';
import { hashPassword } from '../../utils/password.utils';
import { generateToken } from '../../utils/jwt.utils';

// Types pour améliorer la sécurité de type
interface TestUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  role: string;
}

interface TestBook {
  _id: mongoose.Types.ObjectId;
  title: string;
  author: string;
  price: number;
  stock: number;
  description?: string;
  coverUrl?: string;
}

// Créer un utilisateur de test
export const createTestUser = async (role: 'admin' | 'client' = 'client') => {
  const passwordHash = await hashPassword('Password123!');
  const user = await User.create({
    name: `Test ${role}`,
    email: `test-${role}@example.com`,
    passwordHash,
    role
  });

  const token = generateToken({
    userId: user._id.toString(),
    role: user.role
  });

  return { user: user as unknown as TestUser, token };
};

// Créer un livre de test
export const createTestBook = async (): Promise<TestBook> => {
  const book = await Book.create({
    title: `Test Book ${Math.random().toString(36).substring(7)}`,
    author: 'Test Author',
    price: 9.99,
    stock: 10,
    description: 'A test book',
    coverUrl: 'https://example.com/test-book.jpg'
  });

  return book as unknown as TestBook;
};

// Créer un panier de test
export const createTestCart = async (userId: string, bookId: string) => {
  const cart = await Cart.create({
    userId,
    items: [{ bookId, quantity: 1 }]
  });

  return cart;
};

// Nettoyer la base de données de test
export const clearTestData = async () => {
  await User.deleteMany({});
  await Book.deleteMany({});
  await Cart.deleteMany({});
};
