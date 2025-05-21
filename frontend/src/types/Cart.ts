import type { Book } from './Book';

// Typages pour le panier d'achats

export interface CartItem {
  bookId: string;
  quantity: number;
  book?: Book;  // Utiliser le type Book complet plutôt qu'une version partielle
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}
