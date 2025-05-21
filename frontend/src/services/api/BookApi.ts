import type { Book } from '../../types/Book';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Fonctions d'API pour les livres
export const bookApi = {
  // LECTURE PUBLIQUE
  async getAllBooks(): Promise<Book[]> {
    const response = await fetch(`${API_URL}/books`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Erreur ${response.status}`);
    }

    return response.json();
  },

  async getBookById(bookId: string): Promise<Book> {
    const response = await fetch(`${API_URL}/books/${bookId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Erreur ${response.status}`);
    }

    return response.json();
  },

  // ADMIN - CREATE
  async createBook(bookData: Partial<Book>): Promise<Book> {
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
  async updateBook(bookId: string, bookData: Partial<Book>): Promise<Book> {
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
  async deleteBook(bookId: string): Promise<Book> {
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
