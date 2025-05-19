const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Types
export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  stock: number;
  coverUrl: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

// Fonctions d'API pour les livres
export const bookApi = {
  // LECTURE PUBLIQUE
  async getAllBooks() {
    const response = await fetch(`${API_URL}/books`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Erreur ${response.status}`);
    }

    return response.json();
  },

  async getBookById(bookId: string) {
    const response = await fetch(`${API_URL}/books/${bookId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Erreur ${response.status}`);
    }

    return response.json();
  },

  // ADMIN - CREATE
  async createBook(bookData: { title: string, author: string, price: number, stock: number, coverUrl?: string, description?: string }) {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('Non authentifié');

    const response = await fetch(`${API_URL}/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(bookData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Erreur ${response.status}`);
    }

    return response.json();
  },

  // ADMIN - UPDATE
  async updateBook(bookId: string, bookData: { title?: string, author?: string, price?: number, stock?: number, coverUrl?: string, description?: string }) {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('Non authentifié');

    const response = await fetch(`${API_URL}/books/${bookId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(bookData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Erreur ${response.status}`);
    }

    return response.json();
  },

  // ADMIN - DELETE
  async deleteBook(bookId: string) {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('Non authentifié');

    const response = await fetch(`${API_URL}/books/${bookId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Erreur ${response.status}`);
    }

    return response.json();
  }
};
