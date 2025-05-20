// Type aligné avec le modèle backend (book.model.ts)
export interface Book {
  _id: string;               // Utiliser _id directement comme dans MongoDB
  title: string;             // Identique au backend
  author: string;            // Identique au backend
  price: number;             // Identique au backend
  stock: number;             // Renommé pour correspondre à inStock (cohérence avec le backend)
  coverUrl: string;          // Renommé pour correspondre au backend
  description: string;       // Identique au backend
  createdAt?: string;        // Date de création (optionnel côté frontend)
  updatedAt?: string;        // Date de mise à jour (optionnel côté frontend)
}

// Filtre pour la recherche de livres
export interface BookFilter {
  author?: string;
  minPrice?: number;
  maxPrice?: number;
  searchQuery?: string;      // Pour la recherche par titre ou auteur
  inStock?: boolean;         // Pour filtrer uniquement les livres disponibles
}

// Réponse pour les requêtes paginées
export interface BookListResponse {
  books: Book[];
  total: number;
  page: number;
  limit: number;             // Renommé pour correspondre à la terminologie API courante
}
