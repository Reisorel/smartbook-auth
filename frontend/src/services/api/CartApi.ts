import type { Cart, CartItem } from '../../types/Cart';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Supprimer les types commentés car ils sont maintenant importés

// Fonctions d'API pour le panier
export const cartApi = {
  // Obtenir le panier de l'utilisateur
  async getCart(): Promise<Cart> {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('Non authentifié');

    const response = await fetch(`${API_URL}/cart`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Erreur ${response.status}`);
    }

    return response.json();
  },

  // Ajouter un élément au panier
  async addItem(bookId: string, quantity: number = 1): Promise<Cart> {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('Non authentifié');

    const response = await fetch(`${API_URL}/cart/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ bookId, quantity })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Erreur ${response.status}`);
    }

    return response.json();
  },

  // Mettre à jour la quantité d'un élément
  async updateItem(bookId: string, quantity: number): Promise<Cart> {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('Non authentifié');

    const response = await fetch(`${API_URL}/cart/items/${bookId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ quantity })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Erreur ${response.status}`);
    }

    return response.json();
  },

  // Supprimer un élément du panier
  async removeItem(bookId: string): Promise<Cart> {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('Non authentifié');

    const response = await fetch(`${API_URL}/cart/items/${bookId}`, {
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
  },

  // Vider le panier
  async clearCart(): Promise<Cart> {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('Non authentifié');

    const response = await fetch(`${API_URL}/cart`, {
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

// Exporter également les types pour qu'ils soient disponibles pour les importateurs
export type { Cart, CartItem };
