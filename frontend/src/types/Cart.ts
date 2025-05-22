import type { Book } from './Book';

// Typages pour le panier d'achats
export interface CartItem {
  bookId: Book;  // Peut être soit un ID (string), soit un objet Book complet
  quantity: number;
  book?: Book;  // Conserver pour rétrocompatibilité
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}
